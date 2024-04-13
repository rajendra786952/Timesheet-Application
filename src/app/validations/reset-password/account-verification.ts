import { MESSAGES } from '@/app/constants';
import { z } from 'zod';

const accountVerificationSchema = z.object({
  empId: z.string().length(4, MESSAGES.AUTH.EMP_ID_NOT_FOUR_DIGITS)
});

export type AccountVerificationSchema = z.infer<typeof accountVerificationSchema>;

export default accountVerificationSchema;
