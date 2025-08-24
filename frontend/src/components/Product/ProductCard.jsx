import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { dispatch } = useCart();
  const {  setSelectedProduct } = useApp();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', product });
  };
  
  const handleViewProduct = () => {
    setSelectedProduct(product);
    console.log("----------->",product);
    navigate('/product-details');
  };
  
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating || 0) ? 'star-filled' : 'star-empty'}
      />
    ));
  };
  
  return (
    <div className="product-card" onClick={handleViewProduct}>
      <div className="product-image">
        <img 
          src={product.images?.[0]?.url || product.image || 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500'} 
          alt={product.name} 
        />
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
            {renderStars(product.averageRating || product.rating)}
          </div>
          <span className="review-count">({product.reviewCount || product.reviews || 0})</span>
        </div>
        <p className="product-description">{product.shortDescription || product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className="product-stock">
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;