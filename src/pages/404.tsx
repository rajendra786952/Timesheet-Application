import { ScaleFade } from '@chakra-ui/react';

import _404 from '@/containers/404';

const _404Page = () => {
  return (
    <ScaleFade initialScale={0.6} in>
      <_404 />
    </ScaleFade>
  );
};

export default _404Page;
