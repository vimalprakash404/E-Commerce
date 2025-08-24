import { ShoppingCart } from "lucide-react";
import { useCart } from "../../../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

export default function CartButton() {
  const navigate = useNavigate()
  const { getTotalItems } = useCart();

  return (
    <button 
      className="header-btn cart-btn"
      onClick={() => navigate('/cart')}
    >
      <ShoppingCart size={20} />
      {getTotalItems() > 0 && (
        <span className="cart-count">{getTotalItems()}</span>
      )}
    </button>
  );
}
