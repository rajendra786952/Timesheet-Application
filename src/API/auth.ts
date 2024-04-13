import axiosJSON from '@/utils/api';

export const loginApi = async (loginData: { EmpId: number; EmpPass: string }) => {
  return await axiosJSON.post(`login`, loginData);
};

export const verifyOtpApi = async (data: { EmpId: number; Otp: number }) => {
  return await axiosJSON.post(`verify-otp`, data);
};

export const accountVerification = async (data:any) => {
  return await axiosJSON.post(`account-verification`, data);
};

export const resetPasswordApi = async (data: { EmpId: number; EmpPass: string }) => {
  return await axiosJSON.put(`reset-password`, data);
};
