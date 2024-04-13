import SuspenseFallback from '@/components/SuspenseFallback';
import { Suspense } from 'react';
import { Route, Routes, RouteObject } from 'react-router-dom';
import Timesheet from './timesheet';


const App = () => {
 const routers =[
    {
        path: '',
        element: <Timesheet/>,
    },
 ];
 const routesList = routers.map(({ path, element, index }: RouteObject) => {
      return <Route key={path} index={index} path={`/${path}`} element={element} />;
  });
    return (
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
            {routesList}
        </Routes>
      </Suspense>
    )
}

export default App;