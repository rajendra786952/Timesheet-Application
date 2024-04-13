import { z } from 'zod';

import { MESSAGES } from '@/app/constants';

const verifyOtpSchema = z.object({
  otp: z.string().min(6, MESSAGES.AUTH.OTP_TOO_SHORT),
});

export type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;

export default verifyOtpSchema;
