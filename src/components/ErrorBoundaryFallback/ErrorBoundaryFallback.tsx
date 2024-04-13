import { FallbackProps } from 'react-error-boundary';
import { Button, Center, Heading, Text, VStack } from '@chakra-ui/react';

const ErrorBoundaryFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <Center minH="100vh" bg="Background">
      <VStack gap={6}>
        <Heading size="2xl">Something went wrong!</Heading>
        <Text color="neutral.600" size="lg">
          {error?.message}
        </Text>
        <Button variant="outline" onClick={resetErrorBoundary}>
          Try again
        </Button>
      </VStack>
    </Center>
  );
};

export default ErrorBoundaryFallback;
