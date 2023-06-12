import React, { Suspense } from 'react';
import { QueryClient } from 'react-query';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import { ProtectedRouteWithNav } from '@/components/ProtectedRouteWithNav';
// import { Home } from '@/pages/Home';
// import { Login } from '@/pages/Login';
import { loader as recipeLoader } from '@/pages/RecipeById';
// import { Profile } from '@/pages/Profile';
import { Welcome } from '@/pages/Welcome';

const Profile = React.lazy(() =>
  import('@/pages/Profile').then((module) => ({ default: module.Profile }))
);
const RecipeById = React.lazy(() => import('@/pages/RecipeById'));
const Login = React.lazy(() =>
  import('@/pages/Login').then((module) => ({ default: module.Login }))
);

// const Welcome = React.lazy(() =>
//   import('@/pages/Welcome').then((module) => ({ default: module.Welcome }))
// );

const Home = React.lazy(() =>
  import('@/pages/Home').then((module) => ({ default: module.Home }))
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
