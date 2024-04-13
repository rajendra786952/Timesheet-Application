import { useMemo } from 'react';

import { HStack, Text, VStack } from '@chakra-ui/react';

import { CloseCircle, TickCircle } from 'iconsax-react';
import {
  checkIfNumberExists,
  checkIfSpecialCharacterExists,
  checkIfUppercaseLetterExists,
  checkMinimumCharacters,
} from '@/app/utils/password-strength-validation';
import { PasswordStrengthProps, StrengthItem } from '@/components/PasswordStrength/PasswordStrength.types';
import colors from '@/app/theme/foundations/colors';

const PasswordStrength = ({ password, options, error }: PasswordStrengthProps) => {
  const {
    minChars,
    minCharsLabel = `Minimum ${minChars ?? 0} characters`,
    oneUppercaseLabel = 'One uppercase letter',
    oneNumLabel = 'One number',
    oneSpecialCharLabel = 'One special character(!@#$%^&*_)',
    ...rest
  } = options;

  const strengthItemList = useMemo<StrengthItem[]>(
    () => [
      {
        key: 'minChars',
        label: minCharsLabel,
        active: !!minChars,
        error: error === 'minChars',
        fulfills: checkMinimumCharacters(password, minChars),
        count: minChars,
      },
      {
        key: 'oneUppercase',
        label: oneUppercaseLabel,
        active: !!rest.oneUppercase,
        error: error === 'oneUppercase',
        fulfills: checkIfUppercaseLetterExists(password),
        count: 1,
      },
      {
        key: 'oneNum',
        label: oneNumLabel,
        active: !!rest.oneNum,
        error: error === 'oneNum',
        fulfills: checkIfNumberExists(password),
        count: 1,
      },
      {
        key: 'oneSpecialChar',
        label: oneSpecialCharLabel,
        active: !!rest.oneSpecialChar,
        error: error === 'oneSpecialChar',
        fulfills: checkIfSpecialCharacterExists(password),
        count: 1,
      },
    ],
    [minChars, minCharsLabel, oneUppercaseLabel, oneNumLabel, oneSpecialCharLabel, rest],
  );

  return (
    <VStack gap="8px" w="full" alignItems="flex-start">
      {strengthItemList
        .filter(({ active }) => active)
        .map((item) => (
          <HStack gap="4px" key={item.key}>
            {item.error ? (
              <CloseCircle size="24" color={colors.danger[300]} variant="Bulk" />
            ) : (
              <TickCircle size="24" color={item.fulfills ? colors.success[300] : colors.neutral[300]} variant="Bulk" />
            )}
            <Text textStyle="mdRegular" color={item.error ? 'danger.300' : item.fulfills ? 'black' : 'neutral.400'}>
              {item.label}
            </Text>
          </HStack>
        ))}
    </VStack>
  );
};

export default PasswordStrength;
