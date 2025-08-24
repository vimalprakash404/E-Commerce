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
            res.status(201).json(newOrder);
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }

    // GET /orders/user → user’s past orders
    async getUserOrders(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const userId = req.user._id;
            const orders = await order.find({ user: userId }).sort({ createdAt: -1 });
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
            if (!req.user.isAdmin) {
                return res.status(403).json({ message: "Forbidden" });
            }
            const orders = await order.find().sort({ createdAt: -1 });
            res.json(orders);
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }

    // PUT /orders/:id → admin update order status
    async updateOrderStatus(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            const { id } = req.params;
            const { status } = req.body;
            const updatedOrder = await order.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );
            if (!updatedOrder) {
                return res.status(404).json({ message: "Order not found" });
            }
            
            // Emit real-time notification
            const io = req.app.get('io');
            if (io) {
                io.to('admin').emit('order_updated', {
                    orderId: updatedOrder._id,
                    status: updatedOrder.status,
                    updatedAt: new Date()
                });
                
                // Notify the customer
                io.to(`user_${updatedOrder.user}`).emit('order_status_changed', {
                    orderId: updatedOrder._id,
                    status: updatedOrder.status,
                    updatedAt: new Date()
                });
            }
            
            res.json(updatedOrder);
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
        }
    }

    // Validators for each endpoint
 placeOrderValidator = [
    body("address").notEmpty().withMessage("Address is required")
];



 updateOrderStatusValidator = [
    param("id").isMongoId().withMessage("Invalid order ID"),
    body("status").isString().notEmpty().withMessage("Status is required")
];
}



module.exports = new orderController();