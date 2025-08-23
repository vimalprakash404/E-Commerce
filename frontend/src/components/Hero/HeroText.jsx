import { ArrowRight, ShoppingBag } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function HeroText() {
  const { setCurrentView } = useApp();

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
          onClick={() => setCurrentView("products")}
        >
          <ShoppingBag size={20} />
          Shop Now
          <ArrowRight size={16} />
        </button>
        <button className="btn btn-secondary">Learn More</button>
      </div>
    </div>
  );
}
