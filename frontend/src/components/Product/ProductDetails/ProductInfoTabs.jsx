import React from "react";

const ProductInfoTabs = ({ product }) => (
  <div className="product-info-tabs">
    <div className="info-item">
      <strong>Stock Status:</strong> In Stock
    </div>
    <div className="info-item">
      <strong>SKU:</strong> PROD-{product.id.toString().padStart(6, "0")}
    </div>
    <div className="info-item">
      <strong>Category:</strong> {product.category}
    </div>
  </div>
);

export default ProductInfoTabs;
