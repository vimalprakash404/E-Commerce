import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useApp } from "../context/AppContext.jsx";
import ProductImage from "../components/Product/ProductDetails/ProductImage";
import ProductInfo from "../components/Product/ProductDetails/ProductInfo";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
    const navigate = useNavigate();
  const { selectedProduct } = useApp();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return <div>Product not found</div>;

  const handleAddToCart = async () => {
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(selectedProduct);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back to Products
        </button>

        <div className="product-detail-content">
          <ProductImage product={selectedProduct} />
          <ProductInfo
            product={selectedProduct}
            quantity={quantity}
            setQuantity={setQuantity}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
