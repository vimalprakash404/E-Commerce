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
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!selectedProduct) return <div>Product not found</div>;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: "ADD_TO_CART", product: selectedProduct });
    }
  };

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back to Products
        </button>

        <div className="product-detail-content">
          <ProductImage image={selectedProduct.image} name={selectedProduct.name} />
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
