import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Layout = lazy(() => import('@/pages/RestrictedPage/User timesheet/layout'));
const Manager = lazy(() => import('@/pages/RestrictedPage/manager'))

export const userRestrictedRoutes: RouteObject[] = [
  {
    path: 'timesheet',
    element: <Layout />,
  },
]; 

export const managerRestrictedRoutes: RouteObject[] = [
  {
    path: 'manager',
    element: <Manager />,
  },
];


