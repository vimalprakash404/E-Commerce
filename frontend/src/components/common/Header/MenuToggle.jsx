import { Menu } from "lucide-react";

export default function MenuToggle({ isMenuOpen, setIsMenuOpen }) {
  return (
    <button 
      className="menu-toggle"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      <Menu size={20} />
    </button>
  );
}
