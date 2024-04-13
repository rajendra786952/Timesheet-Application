import { Button, FormControl, FormLabel, VStack } from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppToast } from '@/utils/toastUtil';
import AuthLayout from '@/app/layouts/AuthLayout';
import PinInput from '@/components/ui/forms/PinInput';
import { VerifyOtpSchema, verifyOtpSchema } from '@/app/validations';
import { useEffect } from 'react';
import { accountVerification, verifyOtpApi } from '@/API/auth';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setLoader } from '@/app/features/loader/loaderSlice';
import { useNavigate } from 'react-router-dom';

interface VerifyOtpProps {
  setCurrentStep: (step: string) => void;
}

const VerifyOtp = (props: VerifyOtpProps) => {
  const dispatch = useAppDispatch();
  const { successToast, errorToast } = useAppToast();
  const { setCurrentStep } = props;
  const navigate = useNavigate();
  const { user } = useAppSelector<any>((state) => state.user);
  const { control, handleSubmit } = useForm<VerifyOtpSchema>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp:'',
    },
  });

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

  useEffect(() => {
    let id =  sessionStorage.getItem('EmpId');
    if(id === null && user && user.FirstLogin){
      sentOtp()
    }
  },[])

  const sentOtp = async () => {
      dispatch(setLoader(true));
      try {
       const response = await accountVerification({ EmpId:parseInt(user.EmpId)});
        if(response.data?.status_code === 200){
          sessionStorage.setItem('EmpId', user.EmpId);
          successToast('Success!', 'OTP was successfully sent to your registered email Id.');
        }
        else if(response.data?.status_code !== 200){
         errorToast('Error', response.data?.message)
        }
        dispatch(setLoader(false));
      } catch (error:any) {
        dispatch(setLoader(false));
        errorToast('Error', error?.message?.toString());
      }
  }

  const onSubmit = async (data: VerifyOtpSchema) => {
    dispatch(setLoader(true));
    try {
      const EmpId = parseInt(sessionStorage.getItem('EmpId')!);
      let response = await verifyOtpApi({ EmpId: EmpId, Otp: parseInt(data.otp) });
      if(response.data?.status_code === 200){
        successToast('Success', 'OTP successfully verified.');
        setCurrentStep('newPassword');
        sessionStorage.setItem('otp-verify','true')
      }
      else if(response.data?.status_code !== 200){
        errorToast('Error', response.data?.message)
      }
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setLoader(false));
      errorToast('Otp verification failed', 'Please try again');
    }
  };

  return (
    <AuthLayout title="Verify OTP" subtitle="Catch That Code: Verify Your Email OTP">
      <VStack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl id="otp">
          <FormLabel>Enter OTP</FormLabel>
          <Controller
            control={control}
            name="otp"
            render={({ field, fieldState }) => (
              <PinInput
                {...field}
                autoFocus
                size="lg"
                error={fieldState.error ? fieldState.error.message : undefined}
                colorScheme="primary"
                type="number"
              />
            )}
          />
        </FormControl>
        <Button w="full" mt={4} type="submit">
          Confirm OTP
        </Button>
      </VStack>
    </AuthLayout>
  );
};

export default VerifyOtp;
