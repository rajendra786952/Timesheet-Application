import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('@/pages/home'));
const Login = lazy(() => import('@/pages/login'));
const ResetPassword = lazy(() => import('@/pages/reset-password'));
const AccountVerification = lazy(() => import('@/pages/account-verification'));
const _404 = lazy(() => import('@/pages/404'));

const routerData: RouteObject[] = [
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'reset-password',
    element: <ResetPassword />,
  },
  {
    path: 'account-verification',
    element: <AccountVerification />,
  },
  {
    path: '*',
    element: <_404 />,
  },
];

export default routerData;
