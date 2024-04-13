import { useMemo, useState } from 'react';
import NewPassword from '@/containers/ResetPassword/NewPassword';
import VerifyOtp from '@/containers/ResetPassword/VerifyOtp';
import { useAppSelector } from '@/app/store';

const ResetPassword = () => {
  const { user } = useAppSelector<any>((state) => state.user);
  const empId = sessionStorage.getItem('EmpId');
  const otpStatus = sessionStorage.getItem('otp-verify');
  const [currentStep, setCurrentStep] = useState((empId && otpStatus) ? 'newPassword':"verifyOtp");
  
  const resetPasswordSteps = useMemo<Record<typeof currentStep, JSX.Element>>(
    () => ({
      verifyOtp: <VerifyOtp setCurrentStep={setCurrentStep}/>,
      newPassword: <NewPassword />,
    }),
    [currentStep],
  );

  return resetPasswordSteps[currentStep];
};

export default ResetPassword;
