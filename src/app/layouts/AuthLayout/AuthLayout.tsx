import { ReactNode } from 'react';

import { Flex, Heading, Stack, Text, VStack } from '@chakra-ui/react';

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <Stack minH="100vh">
      <Flex p={8} flex={1} align="center" justify="center">
        <Stack spacing={8} w="full" maxW="md">
          <VStack spacing={2} alignItems="flex-start">
            <Heading size="xl">{title}</Heading>
            {!!subtitle && (
              <Text textStyle="mdRegular" color="neutral.600" maxW="md">
                {subtitle}
              </Text>
            )}
          </VStack>
          {children}
        </Stack>
      </Flex>
    </Stack>
  );
};

export default AuthLayout;
