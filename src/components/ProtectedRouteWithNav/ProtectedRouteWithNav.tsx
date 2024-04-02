import { url } from 'inspector';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { Menu } from '@/components/Menu';
import { SearchWrapper } from '@/components/SearchWrapper';
import { useIsAuthenticated } from '@/hooks';

export const ProtectedRouteWithNav = () => {
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  if (isLoading)
    return (
      <div className="absolute  bg-lightBg-500 bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
        <div className="flex items-center">
          <span className="text-3xl mr-4">Loading</span>
          {/* <!-- loading icon --> */}
          <svg
            className="animate-spin h-8 w-8 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {/* <!-- end loading icon --> */}
        </div>
      </div>
    );
  if (!isAuthenticated)
    return (
      <Navigate
        to="/welcome"
        replace
        state={{
          from: pathname,
        }}
      />
    );

  return (
    <div>
      <SearchWrapper>
        <Menu />
        <Outlet />
      </SearchWrapper>
    </div>
  );
};
