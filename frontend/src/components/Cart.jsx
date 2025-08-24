import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, loading, error, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  
  const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content">
          <ShoppingBag size={64} />
          <h2>Please login to view your cart</h2>
          <p>Sign in to see your saved items and continue shopping</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content">
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content">
          <p style={{ color: 'red' }}>Error loading cart: {error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content">
          <ShoppingBag size={64} />
          <h2>Your cart is empty</h2>
          <p>Start shopping to add items to your cart</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="cart">
      <div className="cart-container">
        <div className="cart-header">
          <h2>Shopping Cart ({getTotalItems()} items)</h2>
        </div>
        
        <div className="cart-content">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.product?.images?.[0]?.url || item.product?.image || item.image} alt={item.product?.name || item.name} />
                </div>
                
                <div className="cart-item-details">
                  <h3>{item.product?.name || item.name}</h3>
                  <p className="cart-item-price">${(item.product?.price || item.price || 0).toFixed(2)}</p>
                </div>
                
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleUpdateQuantity(item.product?._id || item.product?.id || item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.product?._id || item.product?.id || item.id, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(item.product?._id || item.product?.id || item.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="cart-item-total">
                  ${((item.product?.price || item.price || 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-line">
              <span>Tax:</span>
              <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
            </div>
            <div className="summary-line total">
              <span>Total:</span>
              <span>${(getTotalPrice() * 1.08).toFixed(2)}</span>
            </div>
            
            <button className="btn btn-primary checkout-btn">
              Proceed to Checkout
            </button>
            
            <button 
              className="btn btn-secondary continue-shopping"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;