import { Suspense } from 'react';
import { Route, RouteObject, Routes, Navigate } from 'react-router-dom';

import routerData from '@/app/router/router.data';
import SuspenseFallback from '@/components/SuspenseFallback';
import { userRestrictedRoutes,  managerRestrictedRoutes } from '@/app/router/restrictedRoutes.data';
import { useAppSelector } from '../store';
import ManagerTimesheetView from '@/pages/RestrictedPage/manager/timesheet';
import UserTimesheet from '@/pages/RestrictedPage/manager/userTimesheet';
import Timesheet from '@/pages/RestrictedPage/User timesheet/timesheet';
import Setting from '@/components/Setting';


const Router = () => {
 
  const { token,user } = useAppSelector<any>((state) => state.user);
  const getElement = (element:any) => {
    if(token && user && !user.FirstLogin &&(user.Role === 'Manager' || user.Role === 'Team Lead')){
      return <Navigate replace to={'/manager'} />
    }
    if(token && user && !user.FirstLogin && user.Role === 'Employee'){
     return <Navigate replace to={'/timesheet'} />;
    }
   return element 
  }

  const checkUserId = (element:any) => {
    let empId = sessionStorage.getItem('EmpId');
    if((user && user.FirstLogin) || empId)
     return element;
    return <Navigate replace to={'/login'} />
  }
  
  const routesList = routerData
    .map(({ path, element, index }: RouteObject) => {
      return (
        <Route
          key={path}
          index={index}
          path={`/${path}`}
          element={path ==='reset-password' ? checkUserId(element) :getElement(element)}
          // element={element}
        />
      );
    })
    .concat(
      managerRestrictedRoutes.map(({ path, element}: RouteObject) => {
       return (
         <Route
           key={path}
           path={`${path}`}
           element={ (token !== null && user !== null && !user.FirstLogin &&(user.Role === 'Team Lead' || user.Role === 'Manager')) ? element : <Navigate replace to={'/login'} />}
         >
           <Route  index={true} element={ <ManagerTimesheetView />} />
           <Route path='my' element= {<Timesheet />} />
           <Route path=':EmpId' element= {<UserTimesheet />}/>
           {/* <Route path='setting' element= {<Setting/>} /> */}
           </Route>
       );
      })
     )
    .concat(
      userRestrictedRoutes.map(({ path, element, index }: RouteObject) => {
        return (
          <Route
            key={path}
            path={`/${path}`}
            element={(token !== null && user !== null && !user.FirstLogin && user.Role === 'Employee')? element : <Navigate replace to={'/login'} />}
          >
           <Route  index={true} element={<Timesheet/>} />
           {/* <Route path='setting' element= {<Setting/>} /> */}
          </Route>
        );
      }),
    )
   
 
  
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
        {routesList}
      </Routes>
    </Suspense>
  );
};

export default Router;
