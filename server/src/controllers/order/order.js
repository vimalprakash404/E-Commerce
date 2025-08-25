const order = require("../../models/order"); 
const cart = require("../../models/cart");
const Product = require("../../models/product");
 
const { body, param, validationResult } = require("express-validator");

class orderController {
    // POST /orders → place order
    async placeOrder(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const userId = req.user._id;
            const userCart = await cart.findOne({ user: userId }).populate("items.product");
            if (!userCart || userCart.items.length === 0) {
                return res.status(400).json({ message: "Cart is empty" });
            }

            // Calculate total
            let total = 0;
            userCart.items.forEach(item => {
                total += (item.product.price || 0) * item.quantity;
            });

            const newOrder = await order.create({
                user: userId,
                items: userCart.items,
                status: "Pending",
                totalPrice: total,
                address: req.body.address,
                createdAt: new Date()
            });

            // Update product stock
            for (const item of userCart.items) {
                await Product.findByIdAndUpdate(
                    item.product._id,
                    { $inc: { stock: -item.quantity } }
                );
            }

            // Emit real-time notification to admins
            const io = req.app.get('io');
            if (io) {
                io.to('admin').emit('new_order', {
                    orderId: newOrder._id,
                    customerName: `${req.user.firstName} ${req.user.lastName}`,
                    total: total,
                    itemCount: userCart.items.length,
                    createdAt: newOrder.createdAt
                });
            }

            await cart.updateOne({ user: userId }, { $set: { items: [], total: 0 } });

            // return populated order
            const populatedOrder = await order.findById(newOrder._id)
                .populate({
                    path: "items.product",
                    select: "name price category",
                    populate: { path: "category", select: "name" }
                })
                .lean();

            // transform category → just category.name
            const transformed = {
                ...populatedOrder,
                items: populatedOrder.items.map(it => ({
                    ...it,
                    product: {
                        ...it.product,
                        category: it.product?.category?.name || null
                    }
                }))
            };

            res.status(201).json(transformed);
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }

    async getUserOrders(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = req.user._id;
        const orders = await order
            .find({ user: userId })
            .populate("items.product") // populate product details
            .populate("user", "firstName lastName email phone") // populate user fields
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

// GET /orders/admin → admin fetch all orders
async getAllOrders(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const orders = await order
            .find()
            .populate("items.product") // populate products
            .populate("user", "firstName lastName email phone") // populate user details
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

    // PUT /orders/:id → admin update order status
    async updateOrderStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedOrder = await order.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            )
            .populate({
                path: "items.product",
                select: "name price category",
                populate: { path: "category", select: "name" }
            })
            .lean();

            if (!updatedOrder) {
                return res.status(404).json({ message: "Order not found" });
            }

            const transformed = {
                ...updatedOrder,
                items: updatedOrder.items.map(it => ({
                    ...it,
                    product: {
                        ...it.product,
                        category: it.product?.category?.name || null
                    }
                }))
            };

            // Emit real-time notification
            const io = req.app.get('io');
            if (io) {
                io.to('admin').emit('order_updated', {
                    orderId: updatedOrder._id,
                    status: updatedOrder.status,
                    updatedAt: new Date()
                });
                
                io.to(`user_${updatedOrder.user}`).emit('order_status_changed', {
                    orderId: updatedOrder._id,
                    status: updatedOrder.status,
                    updatedAt: new Date()
                });
            }
            
            res.json(transformed);
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }

    // Validators
    placeOrderValidator = [
        body("address").isObject().withMessage("Address must be an object"),
        body("address.firstName").notEmpty().withMessage("First name is required").isLength({ max: 50 }).trim(),
        body("address.lastName").notEmpty().withMessage("Last name is required").isLength({ max: 50 }).trim(),
        body("address.email").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
        body("address.phone").notEmpty().withMessage("Phone number is required")
            .matches(/^\+?[\d\s-()]+$/).withMessage("Please enter a valid phone number"),
        body("address.street").notEmpty().withMessage("Street address is required").isLength({ max: 200 }).trim(),
        body("address.city").notEmpty().withMessage("City is required").isLength({ max: 50 }).trim(),
        body("address.state").notEmpty().withMessage("State is required").isLength({ max: 50 }).trim(),
        body("address.zipCode").notEmpty().withMessage("ZIP code is required")
            .matches(/^\d{5}(-\d{4})?$/).withMessage("Please enter a valid ZIP code"),
        body("address.country").notEmpty().withMessage("Country is required").trim()
    ];

    updateOrderStatusValidator = [
        param("id").isMongoId().withMessage("Invalid order ID"),
        body("status").isString().notEmpty().withMessage("Status is required")
    ];
}

module.exports = new orderController();
