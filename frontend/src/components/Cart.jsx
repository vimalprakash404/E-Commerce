import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, dispatch, getTotalPrice, getTotalItems } = useCart();
  const { setCurrentView } = useApp();
  const navigate = useNavigate();
  
  const updateQuantity = (productId, newQuantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity: newQuantity });
  };
  
  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', productId });
  };
  
  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content">
          <ShoppingBag size={64} />
          <h2>Your cart is empty</h2>
          <p>Start shopping to add items to your cart</p>
          <button 
            className="btn btn-primary"
            onClick={() => setCurrentView('products')}
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
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                </div>
                
                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="cart-item-total">
                  ${(item.price * item.quantity).toFixed(2)}
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
              onClick={() => setCurrentView('products')}
            >
              Continue Shopping
            </button>
            
            <button 
              className="btn btn-primary checkout-btn"
              onClick={() => navigate('/bill')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;