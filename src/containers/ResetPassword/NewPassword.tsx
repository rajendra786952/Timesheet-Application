import { Box, Button, FormControl, FormLabel, VStack } from '@chakra-ui/react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppToast } from '@/utils/toastUtil';
import AuthLayout from '@/app/layouts/AuthLayout';
import { PasswordInput } from '@/components/ui';
import { NewPasswordSchema, newPasswordSchema } from '@/app/validations';
import PasswordStrength from '@/components/PasswordStrength';
import { PasswordStrengthKey } from '@/components/PasswordStrength/PasswordStrength.types';
import { useEffect, useState } from 'react';
import { resetPasswordApi } from '@/API/auth';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setLoader } from '@/app/features/loader/loaderSlice';
import { resetEmploy } from '@/app/features/employ/employSlice';
import { resetFilter } from '@/app/features/filter/filterSlice';
import { logOutUser } from '@/app/features/user/userSlice';
import axiosJSON from '@/utils/api';

const NewPassword = () => {
  const dispatch = useAppDispatch();
  const { successToast, errorToast } = useAppToast();
  const navigate = useNavigate();
  const { user } = useAppSelector<any>((state) => state.user);
  const { control, handleSubmit, getValues, getFieldState } = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      newPassword:'',
      confirmNewPassword:'',
    },
  });
  useWatch({ control });

  const redirectToLogin = () => {
    navigate('/login');
  };
  
  useEffect(() => {
    const handleBeforeUnload = (e:any) => {
      const message = "Are you sure you want to go back?";
      e.returnValue = message; 
      return message; 
    };

    const handlePopState = () => {
      const confirmBack = window.confirm("Are you sure you want to go back?");
      if (!confirmBack) {
        navigate(1); 
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);
  
  const onSubmit = async (data: NewPasswordSchema) => {
    dispatch(setLoader(true));
    const EmpId = user && user.EmpId ? user.EmpId : parseInt(sessionStorage.getItem('EmpId')!);
    try {
      const response = await resetPasswordApi({ EmpId: EmpId, EmpPass: data.newPassword });
      if(response.data?.status_code === 200){
        successToast('Success!', 'Password updated successfully!');
        if(user && user.FirstLogin){
          delete axiosJSON.defaults.headers['token'];
          dispatch(logOutUser());
          dispatch(resetEmploy());
          dispatch(resetFilter());
        }
        redirectToLogin();
      }
      else if(response.data?.status_code !== 200){
       errorToast('Error', response.data?.message)
      }
      dispatch(setLoader(false));
    } catch (error:any) {
      dispatch(setLoader(false));
      errorToast('Error', error?.message?.toString());
    }
  };

  return (
    <AuthLayout title="New Password" subtitle="Fresh Start: Create a Brand New Password">
      <VStack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="new-password">
          <FormLabel>New password</FormLabel>
          <Controller
            control={control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                autoFocus
                placeholder="Enter new Password"
                error={fieldState.error ? '' : undefined}
                colorScheme="primary"
              />
            )}
          />
          <Box p="8px">
            <PasswordStrength
              password={getValues('newPassword')}
              options={{
                minChars: 8,
                oneUppercase: true,
                oneNum: true,
                oneSpecialChar: true,
              }}
              error={
                getFieldState('newPassword').error
                  ? (getFieldState('newPassword')!.error!.message as PasswordStrengthKey)
                  : undefined
              }
            />
          </Box>
        </FormControl>
        <FormControl id="confirm-new-password">
          <FormLabel>Confirm password</FormLabel>
          <Controller
            control={control}
            name="confirmNewPassword"
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                placeholder="Re-enter new Password"
                error={fieldState.error ? fieldState.error.message : undefined}
                colorScheme="primary"
              />
            )}
          />
        </FormControl>
        <Button w="full" mt={4} type="submit">
          Set Password
        </Button>
      </VStack>
    </AuthLayout>
  );
};

export default NewPassword;

