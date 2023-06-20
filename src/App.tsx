import { Suspense, lazy } from 'react';
import { QueryClient } from 'react-query';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import { ProtectedRouteWithNav } from '@/components/ProtectedRouteWithNav';
import { Home } from '@/pages/Home';
import { Profile } from '@/pages/Profile';
import RecipeById, { loader as recipeLoader } from '@/pages/RecipeById';
import { Welcome } from '@/pages/Welcome';

const CreateRecipe = lazy(() =>
  import('@/pages/CreateRecipe').then((module) => ({
    default: module.CreateRecipe,
  }))
);
const Login = lazy(() =>
  import('@/pages/Login').then((module) => ({ default: module.Login }))
);

const queryClient = new QueryClient();

const routes = createBrowserRouter([
  {
    path: '/welcome',
    element: (
      <Suspense>
        <Welcome />
      </Suspense>
    ),
  },
  {
    path: '/login',
    element: (
      <Suspense>
        <Login />
      </Suspense>
    ),
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
      {
        path: '/create-recipe',
        element: (
          <Suspense>
            <CreateRecipe />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const App = () => {
  return (
    <div className="bg-lightBg-500 dark:bg-slate-500">
      <RouterProvider router={routes} />
    </div>
  );
};
