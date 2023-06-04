import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { ProtectedRouteWithNav } from '@/components/ProtectedRouteWithNav';
import { Login } from '@/pages/Login';
import { Home } from '@/pages/Home';
import { Profile } from '@/pages/Profile';
import Recipe, { loader as recipeLoader } from './pages/Recipe';
import { QueryClient } from 'react-query';

const queryClient = new QueryClient();

const routes = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRouteWithNav />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/recipe/:recipeId',
        element: <Recipe />,
        loader: recipeLoader(queryClient),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const App = () => {
  return <RouterProvider router={routes} />;
};
