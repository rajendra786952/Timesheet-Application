import { forwardRef } from 'react';

import { Input as ChakraInput, InputProps as ChakraInputProps, VStack } from '@chakra-ui/react';

import HelperText from '@/components/ui/forms/HelperText';

export type InputProps = Omit<ChakraInputProps, 'name'> & {
  name: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <VStack gap="8px" alignItems="flex-start">
      <ChakraInput
        {...props}
        ref={ref}
        isInvalid={props.error !== undefined}
        errorBorderColor="danger.300"
        focusBorderColor={props.error ? 'danger.300' : undefined}
      />
      <HelperText>{props.error}</HelperText>
    </VStack>
  );
});

Input.displayName = 'Input';

export default Input;
