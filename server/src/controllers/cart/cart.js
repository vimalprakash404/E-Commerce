const Cart = require("../../models/cart");

// Helper: flatten product.category → category.name
const transformCart = (cart) => {
    if (!cart || !cart.items) return cart;

    const cartObj = cart.toObject ? cart.toObject() : cart;

    cartObj.items = cartObj.items.map(item => {
        if (item.product && item.product.category && item.product.category.name) {
            return {
                ...item,
                product: {
                    ...item.product,
                    category: item.product.category.name
                }
            };
        }
        return item;
    });

    return cartObj;
};

class cartController {
    // Add item to cart
    async addItem(req, res) {
        try {
            const { productId, quantity } = req.body;
            const userId = req.user._id;

            let cart = await Cart.findOne({ user: userId });
            if (!cart) {
                cart = new Cart({ user: userId, items: [] });
            }

            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();

            // Populate product + category
            await cart.populate({
                path: "items.product",
                populate: { path: "category", select: "name" }
            });

            res.status(200).json(transformCart(cart));
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Remove item from cart
    async removeItem(req, res) {
        try {
            const { productId } = req.body;
            const userId = req.user._id;

            const cart = await Cart.findOne({ user: userId });
            if (!cart) return res.status(404).json({ message: "Cart not found" });

            cart.items = cart.items.filter(item => item.product.toString() !== productId);
            await cart.save();

            await cart.populate({
                path: "items.product",
                populate: { path: "category", select: "name" }
            });

            res.status(200).json(transformCart(cart));
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Clear all items from cart
    async clearCart(req, res) {
        try {
            const userId = req.user._id;
            const cart = await Cart.findOne({ user: userId });
            if (!cart) return res.status(404).json({ message: "Cart not found" });

            cart.items = [];
            await cart.save();

            await cart.populate({
                path: "items.product",
                populate: { path: "category", select: "name" }
            });

            res.status(200).json(transformCart(cart));
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    // Get cart for logged-in user
    async getAll(req, res) {
        try {
            const userId = req.user._id;
            let cart = await Cart.findOne({ user: userId }).populate({
                path: "items.product",
                populate: { path: "category", select: "name" }
            });

            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            res.status(200).json(transformCart(cart));
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new cartController();
