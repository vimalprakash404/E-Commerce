const Cart = require("../../models/cart");

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
            
            // Populate the cart with product details before sending response
            await cart.populate('items.product');
            
            res.status(200).json(cart);
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

            // Populate the cart with product details before sending response
            await cart.populate('items.product');
            
            res.status(200).json(cart);
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

            // Populate the cart with product details before sending response
            await cart.populate('items.product');
            
            res.status(200).json(cart);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getAll(req, res) {
        try {
            const userId = req.user._id;
            const cart = await Cart.findOne({ user: userId }).populate("items.product");
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
            res.status(200).json(cart);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = new cartController();