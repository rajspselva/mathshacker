import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import AdditionsPage from './pages/AdditionsPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import SubtractionsPage from "./pages/SubtractionsPage";
import AdvancedAdditionsPag from './pages/AdvancedAdditionsPage';
import MultiplicationPage from "./pages/MultiplicationPage";

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'additions', element: <AdditionsPage /> },
        { path: 'subtractions', element: <SubtractionsPage /> },
        { path: 'multiplication', element: <MultiplicationPage /> },
        { path: 'advaced-multiplication', element: <MultiplicationPage /> },
        { path: 'advanced-additions', element: <AdvancedAdditionsPag /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
