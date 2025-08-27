
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Texol</h3>
          <p>Your one-stop destination for quality products at great prices. We're committed to providing exceptional shopping experiences.</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Shipping Info</a></li>
            <li><a href="#">Returns</a></li>
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
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Example. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;