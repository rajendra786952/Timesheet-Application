import Header from '@/components/header';
import { ScaleFade, Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import App from '.';


const Layout = () => {
  return (
    <ScaleFade in initialScale={0.6}>
    <Box
      display="flex"
      flexDir="column"
      h='100vh'
    >
      <Box px={6} py={4} >
        <Header />
      </Box>
      <Box  pb={4} h="calc(100vh - 76px)"  overflow="hidden">
      <Outlet />
      </Box>
    </Box>
    </ScaleFade>
  );
};

export default Layout;