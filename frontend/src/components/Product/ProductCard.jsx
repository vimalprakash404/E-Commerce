import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useApp } from '../../context/AppContext.jsx';

const ProductCard = ({ product }) => {
  const { dispatch } = useCart();
  const { setCurrentView, setSelectedProduct } = useApp();
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', product });
  };
  
  const handleViewProduct = () => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };
  
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'star-filled' : 'star-empty'}
      />
    ));
  };
  
  return (
    <div className="product-card" onClick={handleViewProduct}>
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <div className="product-overlay">
          <button className="quick-add-btn" onClick={handleAddToCart}>
            <ShoppingCart size={20} />
            Quick Add
          </button>
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <div className="stars">
            {renderStars(product.rating)}
          </div>
          <span className="review-count">({product.reviews})</span>
        </div>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className="product-stock">In Stock</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;