import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requireVerified = true, requireMentor = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireMentor && user.role !== 'mentor') {
    return <Navigate to="/dashboard" replace />;
  }

  if (!requireMentor && requireVerified && user.verificationStatus !== 'verified') {
    return <Navigate to="/restricted" replace />;
  }

  return children;
};
