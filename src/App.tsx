import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { ProtectedRouteWithNav } from '@/components/ProtectedRouteWithNav';
import { Login } from '@/pages/Login';
import { Home } from '@/pages/Home';
import { Profile } from '@/pages/Profile';
import { Recipe } from './pages/Recipe';

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
        loader: async ({ params }) => {
          const res = await fetch(`/api/recipes/${params.recipeId}`);
          const data = await res.json();
          return data;
        },
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
