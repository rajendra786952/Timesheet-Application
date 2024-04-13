import { useToast } from '@chakra-ui/react';

export const useAppToast = () => {
  const toast = useToast();
  let isToastVisible = false;

  const showToast = (status:any, title:any, description:any,colorScheme:any) => {
    if (!isToastVisible) {
      isToastVisible = true;

      const toastId = toast({
        status,
        title,
        description,
        colorScheme,
        onCloseComplete: () => {
          isToastVisible = false;
        },
      });
      return toastId;
    }
    return null;
  };

  const successToast = (title: string, description: string) => {
    return showToast('success',title,description,'green');
  };

  const errorToast = (title: string, description: string) => {
    return showToast('error',title,description,'red');
  };

  return { successToast, errorToast };
};
