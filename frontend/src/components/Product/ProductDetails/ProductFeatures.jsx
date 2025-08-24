import React from "react";

const ProductFeatures = ({ tags }) => (
  <div className="product-features">
    {tags && tags.length > 0 && <h3>Key Features:</h3>}
    <ul>
      {tags?.map((feature, i) => (
        <li key={i}>{feature}</li>
      ))}
    </ul>
  </div>
);

export default ProductFeatures;
