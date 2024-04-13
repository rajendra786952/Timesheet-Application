import { MESSAGES } from '@/app/constants';
import { z } from 'zod';

const isEmpty = (value:any) => value.trim() !== '';
const isPositiveInteger = (value:any) => /^\d+$/.test(value);
const isMinLength = (value:any) => value.length >= 4 ;
const isMaxLength = (value:any) => value.length <= 5 ;


const loginSchema = z.object({
  empId: z.string().refine(isEmpty,{message:'Please enter an Employee ID.'})
  .refine(value => isPositiveInteger(value), {
    message: 'Employee ID should be a number.',
  })
  .refine(value => isMinLength(value), {
    message: 'Employee ID must be at least 4 digits long.',
  })
  .refine(value => isMaxLength(value), {
    message: 'Employee ID must be 5 digits long.',
  })
  ,
  password: z.string().refine(isEmpty,{message:'Please enter a Password.'}),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export default loginSchema;
