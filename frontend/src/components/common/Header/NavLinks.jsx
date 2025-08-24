import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Home, Package, ShoppingCart, User, Settings } from "lucide-react";

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
            <button onClick={() => navigate("/")} className="nav-link">
                <Home size={18} />
                <span>Home</span>
            </button>
            <button onClick={() => navigate('/products')} className="nav-link">
                <Package size={18} />
                <span>Products</span>
            </button>
            {isAuthenticated && (
                <button onClick={() => navigate('/order')} className="nav-link">
                    <ShoppingCart size={18} />
                    <span>Orders</span>
                </button>
            )}
            {isAuthenticated && user?.roles?.includes('admin') && (
                <button onClick={() => navigate('/admin')} className="nav-link">
                    <Settings size={18} />
                    <span>Admin</span>
                </button>
            )}
            
            {isAuthenticated ? (
                <>
                    <div className="user-info">
                        <User size={16} />
                        <span>Hello, {user?.firstName || 'User'}</span>
                    </div>
                    <button onClick={handleLogout} className="nav-link logout">
                        <span>Logout</span>
                    </button>
                </>
            ) : (
                <button onClick={() => navigate("/login")} className="nav-link login">
                    <User size={18} />
                    <span>Login</span>
                </button>
            )}
        </nav>
    );
}
