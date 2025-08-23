import { useApp } from "../../../context/AppContext.jsx";

export default function NavLinks({ isMenuOpen }) {
  const { setCurrentView } = useApp();

  return (
    <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
      <button onClick={() => setCurrentView("home")}>Home</button>
      <button onClick={() => setCurrentView("products")}>Products</button>
      <button onClick={() => setCurrentView("about")}>About</button>
      <button onClick={() => setCurrentView("contact")}>Contact</button>
    </nav>
  );
}
