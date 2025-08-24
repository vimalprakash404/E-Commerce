import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductImage = ({ product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Get images from product, fallback to single image or placeholder
  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [{ url: product.image, alt: product.name }]
      : [{ url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800', alt: product.name }];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="product-detail-image">
      <div className="main-image-container">
        <img 
          src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${images[selectedImageIndex].url}`} 
          alt={images[selectedImageIndex].alt || product.name} 
          className="main-product-image"
        />
        
        {images.length > 1 && (
          <>
            <button 
              className="image-nav-btn prev-btn" 
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className="image-nav-btn next-btn" 
              onClick={nextImage}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
            
            <div className="image-indicator">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="image-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
              onClick={() => selectImage(index)}
            >
              <img 
                src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${image.url}`} 
                alt={image.alt || `${product.name} ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImage;
