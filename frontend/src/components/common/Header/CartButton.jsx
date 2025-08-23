import { ShoppingCart } from "lucide-react";
import { useCart } from "../../../context/CartContext.jsx";
import { useApp } from "../../../context/AppContext.jsx";

export default function CartButton() {
  const { getTotalItems } = useCart();
  const { setCurrentView } = useApp();

  return (
    <button 
      className="header-btn cart-btn"
      onClick={() => setCurrentView("cart")}
    >
      <ShoppingCart size={20} />
      {getTotalItems() > 0 && (
        <span className="cart-count">{getTotalItems()}</span>
      )}
    </button>
  );
}
