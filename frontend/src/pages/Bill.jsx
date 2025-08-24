import React, { useState } from 'react';
import { CreditCard, MapPin, User, Phone, Mail, Lock, Calendar, Download, Printer } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const Bill = () => {
    const navigate = useNavigate();
  const { items, getTotalPrice, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
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
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  // Frontend validation
  const validateBillingInfo = () => {
    const errors = {};
    
    if (!billingInfo.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (billingInfo.firstName.length > 50) {
      errors.firstName = 'First name cannot exceed 50 characters';
    }
    
    if (!billingInfo.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (billingInfo.lastName.length > 50) {
      errors.lastName = 'Last name cannot exceed 50 characters';
    }
    
    if (!billingInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(billingInfo.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!billingInfo.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(billingInfo.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!billingInfo.street.trim()) {
      errors.street = 'Street address is required';
    } else if (billingInfo.street.length > 200) {
      errors.street = 'Street address cannot exceed 200 characters';
    }
    
    if (!billingInfo.city.trim()) {
      errors.city = 'City is required';
    } else if (billingInfo.city.length > 50) {
      errors.city = 'City cannot exceed 50 characters';
    }
    
    if (!billingInfo.state.trim()) {
      errors.state = 'State is required';
    } else if (billingInfo.state.length > 50) {
      errors.state = 'State cannot exceed 50 characters';
    }
    
    if (!billingInfo.pinCode.trim()) {
      errors.pinCode = 'Pin code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(billingInfo.pinCode)) {
      errors.pinCode = 'Please enter a valid Pin code (e.g., 12345 or 12345-6789)';
    }
    
    if (!billingInfo.country.trim()) {
      errors.country = 'Country is required';
    }
    
    return errors;
  };

  const [validationErrors, setValidationErrors] = useState({});

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlaceOrder = async () => {
    // Validate billing info
    const errors = validateBillingInfo();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setCurrentStep(1); // Go back to billing step if there are errors
      return;
    }
    
    try {
      setPlacingOrder(true);
      setOrderError(null);
      
      const orderData = {
        address: billingInfo,
        paymentInfo: {
          ...paymentInfo,
          cardNumber: paymentInfo.cardNumber.replace(/\s/g, ''), // Remove spaces
        }
      };
      
      await apiService.placeOrder(orderData);
      await clearCart();
      setOrderPlaced(true);
    } catch (error) {
      if (error.message.includes('validation')) {
        // Handle backend validation errors
        setOrderError('Please check your billing information and try again.');
        setCurrentStep(1);
      } else {
        setOrderError(error.message);
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bill-page">
        <div className="bill-container">
          <div className="empty-cart-message">
            <h2>Please login to checkout</h2>
            <p>You need to be logged in to place an order.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bill-page">
        <div className="bill-container">
          <div className="empty-cart-message">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="bill-page">
        <div className="bill-container">
          <div className="empty-cart-message">
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart to proceed with checkout.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/products')}
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
              <div className="order-summary-details">
                <p><strong>Total Items:</strong> {getTotalItems()}</p>
                <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
                <p><strong>Tax:</strong> ₹{tax.toFixed(2)}</p>
                <p><strong>Shipping:</strong> {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</p>
                <p><strong>Total:</strong> ₹{total.toFixed(2)}</p>
              </div>
              <p>A confirmation email has been sent to {billingInfo.email}</p>
            </div>
            <div className="success-actions">
              <button className="btn btn-primary" onClick={() => navigate('/order')}>
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
                          className={validationErrors.firstName ? 'error' : ''}
                          placeholder="First name"
                          required
                        />
                      </div>
                      {validationErrors.firstName && <span className="error-message">{validationErrors.firstName}</span>}
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
                          className={validationErrors.lastName ? 'error' : ''}
                          placeholder="Last name"
                          required
                        />
                      </div>
                      {validationErrors.lastName && <span className="error-message">{validationErrors.lastName}</span>}
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
                          className={validationErrors.email ? 'error' : ''}
                          placeholder="Email address"
                          required
                        />
                      </div>
                      {validationErrors.email && <span className="error-message">{validationErrors.email}</span>}
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
                          className={validationErrors.phone ? 'error' : ''}
                          placeholder="Phone number"
                          required
                        />
                      </div>
                      {validationErrors.phone && <span className="error-message">{validationErrors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <div className="input-wrapper">
                      <MapPin size={20} />
                      <input
                        type="text"
                        name="street"
                        value={billingInfo.street}
                        onChange={handleBillingChange}
                        className={validationErrors.street ? 'error' : ''}
                        placeholder="Street address"
                        required
                      />
                    </div>
                    {validationErrors.street && <span className="error-message">{validationErrors.street}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        name="city"
                        value={billingInfo.city}
                        onChange={handleBillingChange}
                        className={validationErrors.city ? 'error' : ''}
                        placeholder="City"
                        required
                      />
                      {validationErrors.city && <span className="error-message">{validationErrors.city}</span>}
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input
                        type="text"
                        name="state"
                        value={billingInfo.state}
                        onChange={handleBillingChange}
                        className={validationErrors.state ? 'error' : ''}
                        placeholder="State"
                        required
                      />
                      {validationErrors.state && <span className="error-message">{validationErrors.state}</span>}
                    </div>
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input
                        type="text"
                        name="pinCode"
                        value={billingInfo.pinCode}
                        onChange={handleBillingChange}
                        className={validationErrors.pinCode ? 'error' : ''}
                        placeholder="ZIP"
                        required
                      />
                      {validationErrors.pinCode && <span className="error-message">{validationErrors.pinCode}</span>}
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
                      <img 
                        src={item.product?.images?.[0]?.url || item.product?.image || item.image || 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=300'} 
                        alt={item.product?.name || item.name} 
                      />
                      <div className="item-details">
                        <h4>{item.product?.name || item.name}</h4>
                        <p className="item-category">Category: {item.product?.category?.name || item.product?.category || 'General'}</p>
                        <div className="item-pricing">
                          <p>Qty: {item.quantity} × ₹{(item.product?.price || item.price || 0).toFixed(2)}</p>
                          <p className="item-total"><strong>₹{((item.product?.price || item.price || 0) * item.quantity).toFixed(2)}</strong></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="review-addresses">
                  <div className="billing-address">
                    <h4>Billing Address</h4>
                    <p>{billingInfo.firstName} {billingInfo.lastName}</p>
                    <p>{billingInfo.email}</p>
                    <p>{billingInfo.phone}</p>
                    <p>{billingInfo.street}</p>
                    <p>{billingInfo.city}, {billingInfo.state} {billingInfo.pinCode}</p>
                    <p>{billingInfo.country}</p>
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
                  disabled={placingOrder}
                  onClick={handlePlaceOrder}
                >
                  {placingOrder ? 'Placing Order...' : 'Place Order'}
                </button>
              )}
            </div>
          </div>
            {orderError && (
              <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                Error placing order: {orderError}
              </div>
            )}


          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <img 
                    src={item.product?.images?.[0]?.url || item.product?.image || item.image || 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=60'} 
                    alt={item.product?.name || item.name}
                    className="summary-item-image"
                  />
                  <div className="summary-item-details">
                    <div className="item-name">{item.product?.name || item.name}</div>
                    <div className="item-meta">
                      <span className="item-quantity">Qty: {item.quantity}</span>
                      <span className="item-unit-price">₹{(item.product?.price || item.price || 0).toFixed(2)} each</span>
                    </div>
                  </div>
                  <div className="summary-item-total">
                    <strong>₹{((item.product?.price || item.price || 0) * item.quantity).toFixed(2)}</strong>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-line">
                <span>Tax:</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="summary-line total">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;