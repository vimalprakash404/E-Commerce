import React from "react";
import { Star } from "lucide-react";

const ProductRating = ({ rating, reviews }) => {
  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={20}
        className={i < Math.floor(rating) ? "star-filled" : "star-empty"}
      />
    ));

  return (
    <div className="product-rating">
      <div className="stars">{renderStars(rating)}</div>
      <span className="rating-text">
        {rating} ({reviews} reviews)
      </span>
    </div>
  );
};

export default ProductRating;
