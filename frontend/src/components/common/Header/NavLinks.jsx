import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function NavLinks({ isMenuOpen }) {
    const navigate = useNavigate();
    const { isAuthenticated, logout, user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate('/products')}>Products</button>
            {isAuthenticated && (
                <button onClick={() => navigate('/order')}>Orders</button>
            )}
            
            {isAuthenticated ? (
                <>
                    <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Hello, {user?.firstName || 'User'}
                    </span>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <button onClick={() => navigate("/login")}>Login</button>
            )}
        </nav>
    );
}
