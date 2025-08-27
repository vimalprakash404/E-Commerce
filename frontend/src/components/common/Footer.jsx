
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCategories({ limit: 6 }); // Limit to 6 categories for footer
        setCategories(response || []);
      } catch (error) {
        console.error('Error fetching categories for footer:', error);
        // Fallback to empty array if API fails
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug) => {
    navigate(`/products?category=${categorySlug}`);
  };

  // Dynamic quick links based on authentication status
  const getQuickLinks = () => {
    const baseLinks = [
      { label: 'Home', path: '/', show: true },
      { label: 'Products', path: '/products', show: true },
      { label: 'About Us', path: '/about', show: true },
      { label: 'Contact', path: '/contact', show: true },
    ];

    const authLinks = [
      { label: 'My Orders', path: '/order', show: isAuthenticated },
      { label: 'My Cart', path: '/cart', show: isAuthenticated },
      { label: 'Profile', path: '/profile', show: isAuthenticated },
    ];

    const adminLinks = [
      { label: 'Admin Dashboard', path: '/admin', show: isAuthenticated && user?.roles?.includes('admin') },
    ];

    const guestLinks = [
      { label: 'Login', path: '/login', show: !isAuthenticated },
      { label: 'Sign Up', path: '/signup', show: !isAuthenticated },
    ];

    return [...baseLinks, ...authLinks, ...adminLinks, ...guestLinks].filter(link => link.show);
  };

  // Dynamic support links
  const getSupportLinks = () => {
    return [
      { label: 'Help Center', path: '/help', show: true },
      { label: 'FAQs', path: '/faq', show: true },
      { label: 'Shipping Info', path: '/shipping', show: true },
      { label: 'Returns & Exchanges', path: '/returns', show: true },
      { label: 'Size Guide', path: '/size-guide', show: true },
      { label: 'Track Order', path: '/track', show: isAuthenticated },
    ].filter(link => link.show);
  };

  // Dynamic legal links
  const getLegalLinks = () => {
    return [
      { label: 'Privacy Policy', path: '/privacy', show: true },
      { label: 'Terms of Service', path: '/terms', show: true },
      { label: 'Cookie Policy', path: '/cookies', show: true },
      { label: 'Refund Policy', path: '/refund', show: true },
    ].filter(link => link.show);
  };
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Texol</h3>
          <p>Your one-stop destination for quality products at great prices. We're committed to providing exceptional shopping experiences.</p>
          {isAuthenticated && (
            <p className="user-greeting">Welcome back, {user?.firstName || 'Valued Customer'}!</p>
          )}
          <div className="social-links">
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            {getQuickLinks().map((link, index) => (
              <li key={index}>
                <button 
                  onClick={() => navigate(link.path)}
                  className="footer-link"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Customer Support</h4>
          <ul>
            {getSupportLinks().map((link, index) => (
              <li key={index}>
                <button 
                  onClick={() => navigate(link.path)}
                  className="footer-link"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Categories</h4>
          {loading ? (
            <ul>
              <li>Loading categories...</li>
            </ul>
          ) : (
            <ul>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category._id}>
                    <button 
                      onClick={() => handleCategoryClick(category.slug)}
                      className="footer-category-link"
                    >
                      {category.name}
                    </button>
                  </li>
                ))
              ) : (
                <li>No categories available</li>
              )}
            </ul>
          )}
        </div>
        
        <div className="footer-section">
          <h4>Contact Info</h4>
          <div className="contact-info">
            <div className="contact-item">
              <Mail size={16} />
              <span>support@example.com</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>123 Commerce St, City, State 12345</span>
            </div>
          </div>
          
          <div className="footer-legal-links">
            <h5>Legal</h5>
            <ul>
              {getLegalLinks().map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => navigate(link.path)}
                    className="footer-link legal-link"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2024 Texol. All rights reserved.</p>
          {isAuthenticated && user?.roles?.includes('admin') && (
            <div className="admin-footer-info">
              <span>Admin Panel Available</span>
            </div>
          )}
          <div className="footer-bottom-links">
            <button onClick={() => navigate('/privacy')} className="footer-link">Privacy</button>
            <span>•</span>
            <button onClick={() => navigate('/terms')} className="footer-link">Terms</button>
            <span>•</span>
            <button onClick={() => navigate('/sitemap')} className="footer-link">Sitemap</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;