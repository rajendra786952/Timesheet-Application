import { z } from 'zod';

export const isTaskValid = (value:any) => {
    if (typeof value === 'string' && value.trim().length > 0) {
      return true;
    } else if (typeof value === 'object' && Object.keys(value).length > 0) {
      return true;
    }
    return false;
};

const hourSchema = z.object({
  hour: z.string(),
  remark: z.string(),
});

const projectSchema = z.any().refine(isTaskValid, {
    message: 'Project must be either a string or an object with "label" and "value" properties',
  });

const taskSchema = z.any().refine(isTaskValid, {
    message: 'Task must be either a string or an object with "label" and "value" properties',
  });



const weekSchema = z.object({
  Fri: hourSchema,
  Mon: hourSchema,
  Sat: hourSchema,
  Sun: hourSchema,
  Thu: hourSchema,
  Tue: hourSchema,
  Wed: hourSchema,
  isDisabled: z.boolean(),
  project: projectSchema,
  task: taskSchema,
  totalHour: z.string(), 
});

const timesheetSchema = z.object({
    times: z.array(weekSchema)
    // .refine((data) => {
    //   const uniqueSet = new Set(data.map((item) => JSON.stringify(item.project.type+'$'+ item.project.type==='other' ? item.task.trim().toLowerCase() : item.task)));
    //   return uniqueSet.size === data.length;
    // },{
    //   message: "Array elements must be unique",
    // }),
    ,
    dayStatus: z.array(z.string()),
    uniquePairList: z.array(z.string()),
    dayStatusRemark: z.array(z.string()),
    tmsId: z.array(z.string()),
  });


export type TimesheetSchema = z.infer<typeof timesheetSchema>;

export default timesheetSchema;


