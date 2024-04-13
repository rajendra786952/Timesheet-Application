import { useNavigate } from 'react-router-dom';

import { Button, Center, Heading, Stack } from '@chakra-ui/react';

const _404 = () => {
  const navigate = useNavigate();

  const handleNavigateToHome = () => {
    navigate('/');
  };

  return (
    <Center minH="100vh" bg="Background">
      <Stack justifyContent="center" gap={4}>
        <Heading textAlign="center">Page not found</Heading>
        <Button size="lg" variant="link" colorScheme="cyan" onClick={handleNavigateToHome}>
          Go to Home
        </Button>
      </Stack>
    </Center>
  );
};

export default _404;
