import { ScaleFade } from '@chakra-ui/react';

import Login from '@/containers/Login';

const LoginPage = () => {
  return (
    <ScaleFade in initialScale={0.6}>
      <Login />
    </ScaleFade>
  );
};

export default LoginPage;
