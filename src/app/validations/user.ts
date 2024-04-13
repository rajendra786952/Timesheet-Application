import { z } from 'zod';
import { isTaskValid } from './week';

const userSchema = z.object({
DepartmentName:z.any().refine(isTaskValid, {
    message: 'DepartmentName must be either a string or an object with "label" and "value" properties',
  }),
Designation: z.any().refine(isTaskValid, {
    message: 'Designation must be either a string or an object with "label" and "value" properties',
  }),
EmpId: z.any().refine((data) => data.trim() === '',{ message: "Array elements must be unique" }),
EmpName:z.string(),
Role:z.any().refine(isTaskValid, {
    message: 'TeamName must be either a string or an object with "label" and "value" properties',
}),
// Role:z.array(z.string()),
TeamName:z.any().refine(isTaskValid, {
    message: 'TeamName must be either a string or an object with "label" and "value" properties',
  }),
EmpManager:z.any().refine(isTaskValid, {
    message: 'Employ Manager must be either a string or an object with "label" and "value" properties',
  }),
EmpEmail:z.string(),
EmpDate:z.string()
});

export type UserSchema = z.infer<typeof userSchema>;

export default userSchema;