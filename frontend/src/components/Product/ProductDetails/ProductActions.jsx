import React from "react";
import { ShoppingCart, Heart, Share2 } from "lucide-react";

const ProductActions = ({ quantity, setQuantity, onAddToCart }) => (
  <div className="product-actions">
    <div className="quantity-selector">
      <label>Quantity:</label>
      <div className="quantity-controls">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>
    </div>

    <div className="action-buttons">
      <button className="btn btn-primary add-to-cart" onClick={onAddToCart}>
        <ShoppingCart size={20} /> Add to Cart
      </button>
      <button className="btn btn-secondary">
        <Heart size={20} />
      </button>
      <button className="btn btn-secondary">
        <Share2 size={20} />
      </button>
    </div>
  </div>
);

export default ProductActions;
