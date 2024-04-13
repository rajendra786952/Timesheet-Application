import { getNewValueOnBlur } from "@/app/validations/inputTime/inputTime";
import { addDays, endOfWeek, format, isAfter, isSameDay, isWithinInterval, startOfWeek } from "date-fns";
import { WeekTime } from "./dateType";
import { convertDateToIST, getISTDate } from "./timesheet";

export const getWeekDate = (date: Date) => {
    let startOfCurrentWeek = startOfWeek(date, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(date, { weekStartsOn: 1 });
    const weekDates = [];
    while (startOfCurrentWeek <= endOfCurrentWeek) {
      weekDates.push({ date: startOfCurrentWeek, hour: '00:00', day: format(startOfCurrentWeek, 'EEE') });
      startOfCurrentWeek = addDays(startOfCurrentWeek, 1);
    }
    return weekDates;
  };

export const  getCurrentStatus = (date: Date, hour: string,pendingDates:any=[] ) => {
    let currentDate = getISTDate();
    let status: any = pendingDates.length > 0 && pendingDates.includes(format(date,'yyyy-MM-dd')) ? {
      bg: 'warning.100', dateColor: 'warning.400', hourColor: 'warning.500'
    } : 
    isSameDay(date, currentDate)
      ? { bg: 'primary.100', dateColor: 'primary.300', hourColor: 'primary.300' }
      : isAfter(date, currentDate)
      ? { bg: 'transparent', dateColor: 'neutral.400', hourColor: 'neutral.400' }
      : { bg: 'transparent', dateColor: 'neutral.600', hourColor: 'primary.300' };
    let dateStatus = {
      dateString: [format(date, 'EEE') + ',', format(date, 'dd'), format(date, 'MMM')].join(' '),
      hour,
      ...status,
    };
    return dateStatus;
};

export const getWeekTime = (data?:any): WeekTime => {
    return {
      project:data?.project ? data?.project :'',
      task: data?.task ? data?.task :'',
      isDisabled:data?.isDisabled ? data?.isDisabled : false, 
      Mon:data?.Mon ? data['Mon'] : { hour: '00:00', remark: '' },
      Tue: data?.Tue ? data['Tue'] : { hour: '00:00', remark: '' },
      Wed: data?.Wed ? data['Wed'] : { hour: '00:00', remark: '' },
      Thu: data?.Thu ? data['Thu'] : { hour: '00:00', remark: '' },
      Fri: data?.Fri ? data['Fri'] : { hour: '00:00', remark: '' },
      Sat: data?.Sat ? data['Sat'] : { hour: '00:00', remark: '' },
      Sun: data?.Sun ? data['Sun'] : { hour: '00:00', remark: '' },
      totalHour: '00:00',
    };
  };

 export const checkCurrentWeek = (startDate:any,endDate:any) => {
    const currentDate = getISTDate();
    return isWithinInterval(currentDate, {
      start: startDate,
      end: addDays(endDate,1),
    });
  };

export const calculateHourOfDay = (day: any, specificDay: any) => {
    let totalHours = 0;
    let totalMinutes = 0;
    for (const time of specificDay) {
      let [hour, minute] = time[day].hour.split(':').map(Number);
      totalHours += hour;
      totalMinutes += minute;
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
    }
    return getNewValueOnBlur(totalHours + ':' + totalMinutes);
  };
  
 export const getPendingWeekDates = (dates:any) => {
    let pendingWeekDate:any=[]; 
     for(let i of dates){
      //  let date = getWeekDate(new Date(i));
      let date = getWeekDate(convertDateToIST(i));
       let dateRange = `${format(date[0].date,'yyyy-MM-dd')}`;
       if(!pendingWeekDate.includes(dateRange)){
         pendingWeekDate.push(dateRange);
       }
     }
     return pendingWeekDate;
    }