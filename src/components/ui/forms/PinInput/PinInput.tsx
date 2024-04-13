import { forwardRef } from 'react';

import {
  PinInput as ChakraPinInput,
  PinInputField as ChakraPinInputField,
  PinInputProps as ChakraPinInputProps,
  HStack,
  VStack,
} from '@chakra-ui/react';

import HelperText from '@/components/ui/forms/HelperText';

type PinInputFieldProps = Omit<ChakraPinInputProps, 'name' | 'children'> & {
  name: string;
  error?: string;
  count?: 4 | 6;
};

const PinInput = forwardRef<HTMLInputElement, PinInputFieldProps>(({ count = 6, ...props }, ref) => (
  <VStack gap="8px" alignItems="flex-start">
    <HStack>
      <ChakraPinInput
        {...props}
        isInvalid={!!props.error}
        errorBorderColor="danger.300"
        focusBorderColor={props.error ? 'danger.300' : undefined}
      >
        {Array.from({ length: count }).map((_, idx) => (
          <ChakraPinInputField key={idx} ref={idx === 0 ? ref : undefined} />
        ))}
      </ChakraPinInput>
    </HStack>
    <HelperText>{props.error}</HelperText>
  </VStack>
));

PinInput.displayName = 'PinInput';

export default PinInput;
