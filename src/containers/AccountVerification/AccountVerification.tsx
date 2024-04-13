import { Button, FormControl, FormLabel, VStack } from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AccountVerificationSchema, accountVerificationSchema } from '@/app/validations';
import AuthLayout from '@/app/layouts/AuthLayout';
import { Input } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { accountVerification } from '@/API/auth';
import { useAppDispatch } from '@/app/store';
import { useAppToast } from '@/utils/toastUtil';
import { setLoader } from '@/app/features/loader/loaderSlice';
import { useEffect } from 'react';
import { resetEmploy } from '@/app/features/employ/employSlice';
import { resetFilter } from '@/app/features/filter/filterSlice';
import { logOutUser } from '@/app/features/user/userSlice';
import axiosJSON from '@/utils/api';


const AccountVerification = () => {
  const navigate = useNavigate(); 
  const dispatch = useAppDispatch();
  const { successToast, errorToast } = useAppToast();
  const { control, handleSubmit } = useForm<AccountVerificationSchema>({
    resolver: zodResolver(accountVerificationSchema),
    defaultValues: {
      empId:''
    },
  });
 useEffect(() => {
  sessionStorage.clear();
  delete axiosJSON.defaults.headers['token'];
  dispatch(logOutUser());
  dispatch(resetEmploy());
  dispatch(resetFilter());
 },[])
  const onSubmit = async (data: AccountVerificationSchema) => {
    dispatch(setLoader(true));
    try {
     const response = await accountVerification({ EmpId:parseInt(data.empId)});
      if(response.data?.status_code === 200){
        sessionStorage.setItem('EmpId', data.empId);
        successToast('Success!', 'OTP was successfully sent to your registered email Id.');
        navigate('/reset-password');
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
    <AuthLayout title="Account Verification" subtitle="Get Back In: Confirm Your Account with Employee ID">
      <VStack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="emp-id">
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
                type="number"
              />
            )}
          />
        </FormControl>
        <Button w="full" mt={4} type="submit">
          Send OTP
        </Button>
      </VStack>
    </AuthLayout>
  );
};

export default AccountVerification;


