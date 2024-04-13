import { Button, Checkbox, FormControl, FormLabel, Stack, useToast, VStack } from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import AuthLayout from '@/app/layouts/AuthLayout';
import { Input, PasswordInput } from '@/components/ui';
import { LoginSchema, loginSchema } from '@/app/validations';
import { useAppDispatch } from '@/app/store';
import { setCredentials, setToken } from '@/app/features/user/userSlice';
import { loginApi } from '@/API/auth';
import axiosJSON from '@/utils/api';
import { setLoader } from '@/app/features/loader/loaderSlice';
import { useAppToast } from '@/utils/toastUtil';
import { useEffect } from 'react';

const Login = () => {
  sessionStorage.clear();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { successToast, errorToast } = useAppToast();

  const { control, handleSubmit } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      empId: '',
      password: '',
    },
  });



  const onSubmit = async (data: LoginSchema) => {
    dispatch(setLoader(true));
    try {
      const res = await loginApi({ EmpId: parseInt(data.empId), EmpPass: data.password });
      if(res.data.status_code === 200){
        successToast('Success',res.data.message);
        const token = res.data.response.Token;
        axiosJSON.defaults.headers['token']=token;
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('EmpId', data.empId);
        dispatch(setCredentials({ token: token,user : res.data.response }));
        if(res.data.response.FirstLogin){
          navigate('/reset-password')
        }
        else{
          navigate('/timesheet');
        }
      }
      else{
        errorToast('Error',res.data.message);
      }
      dispatch(setLoader(false));
    } catch (error:any) {
      dispatch(setLoader(false));
      errorToast('Error',error?.message?.toString());
    }
  };

  const handleResetPasswordClick = () => {
    navigate('/account-verification');
  };

  const handleKeyPress = (e:any) => {
    if(e.target.value.length > 4){
      e.preventDefault();
    }
    if (e.charCode < 48 || e.charCode > 57) {
       e.preventDefault();
    }
  }

  return (
    <AuthLayout title="Sign in to your account" subtitle="Let's Get Started: Enter your credentials">
      <VStack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="email">
          <FormLabel>Employee ID</FormLabel>
          <Controller
            control={control}
            name="empId"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                autoFocus
                placeholder="Enter employee ID"
                error={fieldState.error ? fieldState.error.message : undefined}
                colorScheme="primary"
                type="text"
                onKeyPress={(e) => handleKeyPress(e)}
              />
            )}
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                placeholder="Enter your password"
                error={fieldState.error ? fieldState.error.message : undefined}
                colorScheme="primary"
              />
            )}
          />
        </FormControl>
        <Stack spacing={6} w="full">
          <Stack direction={{ base: 'column', sm: 'row' }} align="start" justify="space-between">
            <Checkbox colorScheme="primary">Remember me</Checkbox>
            <Button variant="link" colorScheme="primary" onClick={handleResetPasswordClick}>
              Reset password
            </Button>
          </Stack>
          <Button type="submit">Sign in</Button>
        </Stack>
      </VStack>
    </AuthLayout>
  );
};

export default Login;
