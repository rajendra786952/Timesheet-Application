import Header from '@/components/header';
import { ScaleFade, Box } from '@chakra-ui/react';
import {  useEffect, useState } from 'react';
import { Outlet, useLocation} from 'react-router-dom';


const Manager = () => {
 const { pathname } = useLocation();
 const lastPartOfPath = pathname.substring(pathname.lastIndexOf('/') + 1);
 const [activeTab, setActiveTab] = useState(lastPartOfPath === 'my' ? 'My Timesheets' : 'All Timesheets');
 
 useEffect(() => {
  setActiveTab(lastPartOfPath === 'my' ? 'My Timesheets' : 'All Timesheets')
 },[lastPartOfPath])

  return (
    <ScaleFade in initialScale={0.6}>
    <Box
      display="flex"
      flexDir="column"
      h='100vh'
    >
      <Box px={6} py={4} >
        <Header tab={true} activeTab={activeTab} setActiveTab = {setActiveTab} />
      </Box>
      <Box  pb={4} h="calc(100vh - 76px)"  overflow="hidden">
      <Outlet />
      </Box>
    </Box>
    </ScaleFade>
  );
};

export default Manager;