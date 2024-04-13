import { MESSAGES } from '@/app/constants';
import {
  checkIfNumberExists,
  checkIfSpecialCharacterExists,
  checkIfUppercaseLetterExists,
} from '@/app/utils/password-strength-validation';
import { PASSWORD_STRENGTH_KEYS } from '@/components/PasswordStrength/PasswordStrength.types';
import { z } from 'zod';

const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, PASSWORD_STRENGTH_KEYS.minChars)
      .refine((pwd) => checkIfUppercaseLetterExists(pwd), PASSWORD_STRENGTH_KEYS.oneUppercase)
      .refine((pwd) => checkIfNumberExists(pwd), PASSWORD_STRENGTH_KEYS.oneNum)
      .refine((pwd) => checkIfSpecialCharacterExists(pwd), PASSWORD_STRENGTH_KEYS.oneSpecialChar),
    confirmNewPassword: z.string(),
  })
  .superRefine(({ newPassword, confirmNewPassword }, ctx) => {
    if (newPassword !== confirmNewPassword) {
      ctx.addIssue({
        code: 'custom',
        message: MESSAGES.AUTH.PASSWORDS_DO_NOT_MATCH,
        path: ['confirmNewPassword'],
      });
    }
  });

export type NewPasswordSchema = z.infer<typeof newPasswordSchema>;

export default newPasswordSchema;
