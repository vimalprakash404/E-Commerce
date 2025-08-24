import { useNavigate } from "react-router-dom";

export default function NavLinks({ isMenuOpen }) {
    const navigate = useNavigate()

    return (
        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate('/products')}>Products</button>
            <button onClick={() => navigate('/order')}>orders</button>
            
            <button onClick={() => navigate("/login")}>Login</button>
        </nav>
    );
}
