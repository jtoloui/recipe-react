import { useIsAuthenticated } from '@/hooks';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useIsAuthenticated();
  if (isLoading) return <div>Loading...</div>;

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
