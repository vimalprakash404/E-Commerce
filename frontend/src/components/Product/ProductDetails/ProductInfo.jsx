import React from "react";
import ProductRating from "./ProductRating";
import ProductFeatures from "./ProductFeatures";
import ProductActions from "./ProductActions";
import ProductInfoTabs from "./ProductInfoTabs";

const ProductInfo = ({ product, quantity, setQuantity, onAddToCart }) => {
  return (
    <div className="product-detail-info">
      <h1>{product.name}</h1>

      <ProductRating rating={product.rating} reviews={product.reviews} />

      <p className="product-price">${product.price.toFixed(2)}</p>
      <p className="product-description">{product.description}</p>

      <ProductFeatures features={product.tags} />

      <ProductActions
        quantity={quantity}
        setQuantity={setQuantity}
        onAddToCart={onAddToCart}
      />

      <ProductInfoTabs product={product} />
    </div>
  );
};

export default ProductInfo;
