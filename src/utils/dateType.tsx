export type Option = {
    label: string;
    value: string;
  };

export type WeekTime = {
    isDisabled:any;
    project: { label: string; value: string,project_type:string} | any ;
    task: { label: string; value: string } | any;
    totalHour: string;
    [x: string]:
      | Option
      | string
      | {
          hour: string;
          remark: string;
        };
  };