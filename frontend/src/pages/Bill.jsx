import React, { useState } from 'react';
import { CreditCard, MapPin, User, Phone, Mail, Lock, Calendar, Download, Printer } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';

const Bill = () => {
    const navigate = useNavigate();
  const { items, getTotalPrice, dispatch } = useCart();
  const { setCurrentView } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    saveCard: false
  });

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlaceOrder = () => {
    // Simulate order placement
    setOrderPlaced(true);
    dispatch({ type: 'CLEAR_CART' });
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="bill-page">
        <div className="bill-container">
          <div className="empty-cart-message">
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart to proceed with checkout.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentView('products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="bill-page">
        <div className="bill-container">
          <div className="order-success">
            <div className="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase. Your order #ORD-{Date.now().toString().slice(-6)} has been confirmed.</p>
            <div className="order-summary">
              <h3>Order Summary</h3>
              <p><strong>Total: ${total.toFixed(2)}</strong></p>
              <p>You will receive a confirmation email shortly.</p>
            </div>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate('/orders')}>
                View Orders
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/')}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bill-page">
      <div className="bill-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <span>1</span>
              <label>Billing</label>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <span>2</span>
              <label>Payment</label>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <span>3</span>
              <label>Review</label>
            </div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            {currentStep === 1 && (
              <div className="billing-section">
                <h2>Billing Information</h2>
                <form className="billing-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name</label>
                      <div className="input-wrapper">
                        <User size={20} />
                        <input
                          type="text"
                          name="firstName"
                          value={billingInfo.firstName}
                          onChange={handleBillingChange}
                          placeholder="First name"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <div className="input-wrapper">
                        <User size={20} />
                        <input
                          type="text"
                          name="lastName"
                          value={billingInfo.lastName}
                          onChange={handleBillingChange}
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <div className="input-wrapper">
                        <Mail size={20} />
                        <input
                          type="email"
                          name="email"
                          value={billingInfo.email}
                          onChange={handleBillingChange}
                          placeholder="Email address"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <div className="input-wrapper">
                        <Phone size={20} />
                        <input
                          type="tel"
                          name="phone"
                          value={billingInfo.phone}
                          onChange={handleBillingChange}
                          placeholder="Phone number"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <div className="input-wrapper">
                      <MapPin size={20} />
                      <input
                        type="text"
                        name="address"
                        value={billingInfo.address}
                        onChange={handleBillingChange}
                        placeholder="Street address"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={billingInfo.city}
                        onChange={handleBillingChange}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={billingInfo.state}
                        onChange={handleBillingChange}
                        placeholder="State"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={billingInfo.zipCode}
                        onChange={handleBillingChange}
                        placeholder="ZIP"
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div className="payment-section">
                <h2>Payment Information</h2>
                <form className="payment-form">
                  <div className="form-group">
                    <label>Card Number</label>
                    <div className="input-wrapper">
                      <CreditCard size={20} />
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <div className="input-wrapper">
                        <Calendar size={20} />
                        <input
                          type="text"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <div className="input-wrapper">
                        <Lock size={20} />
                        <input
                          type="text"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <div className="input-wrapper">
                      <User size={20} />
                      <input
                        type="text"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        placeholder="Name on card"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        name="saveCard"
                        checked={paymentInfo.saveCard}
                        onChange={handlePaymentChange}
                      />
                      <span>Save this card for future purchases</span>
                    </label>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 3 && (
              <div className="review-section">
                <h2>Review Your Order</h2>
                <div className="review-items">
                  {items.map(item => (
                    <div key={item.id} className="review-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="review-addresses">
                  <div className="billing-address">
                    <h4>Billing Address</h4>
                    <p>{billingInfo.firstName} {billingInfo.lastName}</p>
                    <p>{billingInfo.address}</p>
                    <p>{billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}</p>
                    <p>{billingInfo.email}</p>
                    <p>{billingInfo.phone}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="checkout-navigation">
              {currentStep > 1 && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </button>
              )}
              
              {currentStep < 3 ? (
                <button 
                  className="btn btn-primary"
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Continue
                </button>
              ) : (
                <button 
                  className="btn btn-primary"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
              )}
            </div>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-line">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-line total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;