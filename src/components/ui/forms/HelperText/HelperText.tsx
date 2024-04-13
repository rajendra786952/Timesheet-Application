import { ReactNode } from 'react';

import { Text } from '@chakra-ui/react';

type HelperTextProps = {
  children: ReactNode;
};

const HelperText = ({ children }: HelperTextProps) => {
  return (
    <Text textStyle="smRegular" color="danger.300">
      {children}
    </Text>
  );
};

export default HelperText;
