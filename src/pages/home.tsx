import { ScaleFade } from '@chakra-ui/react';

import Home from '@/containers/Home';

const HomePage = () => {
  return (
    <ScaleFade in initialScale={0.6}>
      <Home />
    </ScaleFade>
  );
};

export default HomePage;
