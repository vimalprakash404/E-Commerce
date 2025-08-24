import React from "react";

const ProductImage = ({ image, name }) => (
  <div className="product-detail-image">
    <img src={image} alt={name} />
  </div>
);

export default ProductImage;
