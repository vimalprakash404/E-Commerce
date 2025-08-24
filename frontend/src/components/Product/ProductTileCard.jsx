import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';

const ProductTileCard = ({ product, viewMode, onViewProduct, onAddToCart }) => {
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star key={i} size={14} className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'} />
    ));

  return (
    <div className={`product-item ${viewMode}`}>
      <div className="product-image" onClick={() => onViewProduct(product)}>
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-details">
        <h3 onClick={() => onViewProduct(product)}>{product.name}</h3>
        <div className="product-rating">
          <div className="stars">{renderStars(product.rating)}</div>
          <span>({product.reviews})</span>
        </div>
        <p className="product-description">{product.description}</p>
        <div className="product-price">${product.price.toFixed(2)}</div>
        <button className="btn btn-primary add-to-cart-btn" onClick={() => onAddToCart(product)}>
          <ShoppingCart size={14} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductTileCard;
