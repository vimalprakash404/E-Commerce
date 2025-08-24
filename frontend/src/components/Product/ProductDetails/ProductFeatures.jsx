import React from "react";

const ProductFeatures = ({ features }) => (
  <div className="product-features">
    <h3>Key Features:</h3>
    <ul>
      {features.map((feature, i) => (
        <li key={i}>{feature}</li>
      ))}
    </ul>
  </div>
);

export default ProductFeatures;
