import { ScaleFade } from '@chakra-ui/react';

import ResetPassword from '@/containers/ResetPassword';

const ResetPasswordPage = () => {
  return (
    <ScaleFade in initialScale={0.6}>
      <ResetPassword />
    </ScaleFade>
  );
};

export default ResetPasswordPage;
