import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { ProtectedRouteWithNav } from '@/components/ProtectedRouteWithNav';
import { Welcome } from '@/pages/Welcome';
import { Home } from '@/pages/Home';
import { Profile } from '@/pages/Profile';
import RecipeById, { loader as recipeLoader } from './pages/RecipeById';
import { QueryClient } from 'react-query';
import { Login } from './pages/Login';

const queryClient = new QueryClient();

const routes = createBrowserRouter([
  {
    path: '/welcome',
    element: <Welcome />,
  },
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
        path: '/settings',
        element: <div>Settings</div>,
      },
      {
        path: '/recipe/:recipeId',
        element: <RecipeById />,
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
