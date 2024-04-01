import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense, lazy } from 'react';
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

import { ForgotPassword } from './pages/ForgotPassword';
import { Page404 } from './pages/Page404';
import { VerifyEmailSignUp } from './pages/VerifyEmailSignUp';

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
    path: '/verify-email',
    element: <VerifyEmailSignUp />,
  },
  {
    path: '/reset-password',
    element: <ForgotPassword />,
  },
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
        errorElement: <Page404 />,
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
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
};
