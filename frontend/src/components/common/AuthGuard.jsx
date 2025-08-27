import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AuthGuard = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      if (requireAdmin && (!user?.roles?.includes('admin'))) {
        navigate('/');
        return;
      }
    }
  }, [isAuthenticated, user, loading, navigate, requireAdmin]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render children if not authenticated or not admin (when required)
  if (!isAuthenticated || (requireAdmin && !user?.roles?.includes('admin'))) {
    return null;
  }

  return children;
};

export default AuthGuard;