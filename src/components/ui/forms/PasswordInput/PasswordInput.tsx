import { forwardRef } from 'react';

import {
  Input as ChakraInput,
  IconButton,
  InputGroup,
  InputRightElement,
  Tooltip,
  VStack,
  useBoolean,
} from '@chakra-ui/react';
import { Eye, EyeSlash } from 'iconsax-react';

import HelperText from '@/components/ui/forms/HelperText';
import { InputProps } from '@/components/ui/forms/Input/Input';
import colors from '@/app/theme/foundations/colors';

export type PasswordInputProps = Omit<InputProps, 'type'>;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
  const [show, methods] = useBoolean(false);

  return (
    <VStack gap="8px" alignItems="flex-start">
      <InputGroup size="md" ref={ref}>
        <ChakraInput
          {...props}
          ref={ref}
          isInvalid={props.error !== undefined}
          errorBorderColor="danger.300"
          focusBorderColor={props.error ? 'danger.300' : undefined}
          pr="48px"
          type={show ? 'text' : 'password'}
        />
        <InputRightElement width="48px">
          <IconButton size="sm" variant="link" aria-label="Toggle password visibility" onClick={methods.toggle}>
            <Tooltip hasArrow label={`${show ? 'Hide' : 'Show'} password`}>
              <span>
                {show ? (
                  <EyeSlash size="24" color={colors.neutral[500]} variant="Broken" />
                ) : (
                  <Eye size="24" color={colors.neutral[500]} variant="Broken" />
                )}
              </span>
            </Tooltip>
          </IconButton>
        </InputRightElement>
      </InputGroup>
      <HelperText>{props.error}</HelperText>
    </VStack>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
