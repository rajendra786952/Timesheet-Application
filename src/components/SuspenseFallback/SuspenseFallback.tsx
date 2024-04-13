import { Center, Spinner } from '@chakra-ui/react';

const SuspenseFallback = () => {
  return (
    <Center minH="100vh" bg="Background">
      <Spinner size="xl" thickness="6px" color="teal" />
    </Center>
  );
};

export default SuspenseFallback;
