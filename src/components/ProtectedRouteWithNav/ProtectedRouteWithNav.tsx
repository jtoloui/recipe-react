import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useIsAuthenticated } from '@/hooks';
import { Menu } from '@/components/Menu';
import { useEffect } from 'react';

export const ProtectedRouteWithNav = () => {
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div>
      <Menu />
      <Outlet />
    </div>
  );
};
