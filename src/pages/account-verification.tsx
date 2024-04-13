import { ScaleFade } from '@chakra-ui/react';

import AccountVerification from '@/containers/AccountVerification';

const AccountVerificationPage = () => {
  return (
    <ScaleFade in initialScale={0.6}>
      <AccountVerification />
    </ScaleFade>
  );
};

export default AccountVerificationPage;
