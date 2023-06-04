import { Navigate, Outlet } from 'react-router-dom';

import { useIsAuthenticated } from '@/hooks';
import { Menu } from '@/components/Menu';

export const ProtectedRouteWithNav = () => {
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <div>
      <Menu />
      <Outlet />
    </div>
  );
};
