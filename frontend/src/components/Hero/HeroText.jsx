import { ArrowRight, ShoppingBag } from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function HeroText() {
  const navigation = useNavigate();
  

  return (
    <div className="hero-text">
      <h1>Discover Amazing Products</h1>
      <p>
        Shop the latest trends and find everything you need in one place.
        Quality products, competitive prices, and exceptional service.
      </p>
      <div className="hero-actions">
        <button
          className="btn btn-primary"
          onClick={() => navigation("/products")}
        >
          <ShoppingBag size={20} />
          Shop Now
          <ArrowRight size={16} />
        </button>
       
      </div>
    </div>
  );
}
