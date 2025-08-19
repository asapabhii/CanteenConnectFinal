import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export const ProtectedRoute = ({ role }: { role?: string }) => {
  const { token, user } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a role is required, check if the user has it
  if (role && user?.role !== role) {
    // Redirect to a default page if role doesn't match
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};