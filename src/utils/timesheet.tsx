import { getNewValueOnBlur } from '@/app/validations/inputTime/inputTime';
import { calculateHourOfDay, getWeekTime } from './date';
import {
  interviewList,
  // otherList,
  productList,
  projectList,
  selfLearningList,
  supportList,
  testList,
  trainingList,
} from './timehseetApi';

export const setTimesheetApiData = (timesheet: any, weekDates: any) => {
  let timesheetFormData: any = [];
  let listOfTask = [];
  let uniquePair: any = [];
  let dayStatus = new Array(7).fill({ TmsStatus: '', remark: '' });
  for (let i of timesheet) {
    let date = convertDateToIST(i.Date);
    let dayindex = date.getDay() - 1;
    dayindex = dayindex === -1 ? 6 : dayindex;
    for (let key in i) {
      switch (key) {
        case 'InterviewsTaken':
          if (i[key].length > 0) {
            let project = getSpecificProjectType('interview');
            let task = interviewList;
            for (let index = 0; index < i[key].length; index++) {
              let temp: any = { isDisabled: true };
              let uniquePairIndex = uniquePair.indexOf(`interview-${i[key][index].InterviewRound}`);
              if (uniquePairIndex === -1) {
                temp['project'] = project;
                temp['task'] = { label: i[key][index].InterviewRound, value: i[key][index].InterviewRound };
                temp[weekDates[dayindex].day] = {
                  hour: getNewValueOnBlur(i[key][index].DurationOfHours.toString()),
                  remark: i[key][index].TaskDescription,
                };
                listOfTask.push(task);
                timesheetFormData.push(getWeekTime(temp));
                uniquePair.push(`interview-${i[key][index].InterviewRound}`);
              } else {
                timesheetFormData[uniquePairIndex][weekDates[dayindex].day] = {
                  hour: getNewValueOnBlur(i[key][index].DurationOfHours.toString()),
                  remark: i[key][index].TaskDescription,
                };
              }
            }
          }
          break;
        case 'OthersData':
          if (i[key].length > 0) {
            let project = getSpecificProjectType('other');
            // let task = otherList;
            for (let index = 0; index < i[key].length; index++) {
              let temp: any = { isDisabled: true };
              let uniquePairIndex = uniquePair.indexOf(`other-${i[key][index].Task.trim()}`);
              if (uniquePairIndex === -1) {
                temp['project'] = project;
                temp['task'] =  i[key][index].Task;
                temp[weekDates[dayindex].day] = {
                  hour: getNewValueOnBlur(i[key][index].DurationOfHours.toString()),
                  remark: i[key][index]?.TaskDescription ? i[key][index]?.TaskDescription : '',
                };
                listOfTask.push([]);
                timesheetFormData.push(getWeekTime(temp));
                uniquePair.push(`other-${i[key][index].Task.trim()}`);
              } else {
                timesheetFormData[uniquePairIndex][weekDates[dayindex].day] = {
                  hour: getNewValueOnBlur(i[key][index].DurationOfHours.toString()),
                  remark: i[key][index]?.TaskDescription ? i[key][index]?.TaskDescription : '',
                };
              }
            }
          }
          break;
        case 'TestData':
          if (i[key].length > 0) {
            let project = getSpecificProjectType('test');
            let task = testList;
            for (let index = 0; index < i[key].length; index++) {
              let temp: any = { isDisabled: true };
              let uniquePairIndex = uniquePair.indexOf(`test-${i[key][index].TestId}`);
              if (uniquePairIndex === -1) {
                temp['project'] = project;
                temp['task'] = { label: 'Test-' + i[key][index].TestId, value: i[key][index].TestId };
                temp[weekDates[dayindex].day] = {
                  hour: getNewValueOnBlur(i[key][index].DurationOfHours.toString()),
                  remark: i[key][index].TaskDescription,
                };
                listOfTask.push(task);
                timesheetFormData.push(getWeekTime(temp));
                uniquePair.push(`test-${i[key][index].TestId}`);
              } else {
                timesheetFormData[uniquePairIndex][weekDates[dayindex].day] = {
                  hour: getNewValueOnBlur(i[key][index].DurationOfHours.toString()),
                  remark: i[key][index].TaskDescription,
                };
              }
            }
          }
          break;
        case 'HelpOrProxy':
          if (i[key].length > 0) {
            let task = supportList;
            for (let index = 0; index < i[key].length; index++) {
              let temp: any = { isDisabled: true };
              let uniquePairIndex = uniquePair.indexOf(`${i[key][index].ProjectId}-${i[key][index].Type}`);
              if (uniquePairIndex === -1) {
                let project = getSpecificProjectType(i[key][index].ProjectId);
                temp['project'] = project;
                temp['task'] = { label: i[key][index].Type, value: i[key][index].Type };
                temp[weekDates[dayindex].day] = {
                  hour: getNewValueOnBlur(i[key][index].DurationOfHours.toString()),
                  remark: i[key][index]?.TaskDescription ? i[key][index]?.TaskDescription : '',
                };
                listOfTask.push(task);
                timesheetFormData.push(getWeekTime(temp));
                uniquePair.push(`${i[key][index].ProjectId}-${i[key][index].Type}`);
              } else {
                timesheetFormData[uniquePairIndex][weekDates[dayindex].day] = {
                  hour: getNewValueOnBlur(i[key][index].DurationOfHours.toString()),
                  remark: i[key][index]?.TaskDescription ? i[key][index]?.TaskDescription : '',
                };
              }
            }
          }
          break;
        case 'ProjectData':
          if (i[key].length > 0) {
            for (let index = 0; index < i[key].length; index++) {
              let temp: any = { isDisabled: true };
              let uniquePairIndex = uniquePair.indexOf(`${i[key][index].ProjectId}-${i[key][index].TaskType}`);
              if (uniquePairIndex === -1) {
                let project = getSpecificProjectType(i[key][index].ProjectId);
                temp['project'] = project;
                temp['task'] = { label: i[key][index].TaskType, value: i[key][index].TaskType };
                let task =
                  project.type === 'Product' ? productList : project.type === 'Training' ? trainingList : supportList;
                temp[weekDates[dayindex].day] = {
                  hour: getNewValueOnBlur(i[key][index].DurationOfHours.toString()),
                  remark: i[key][index].TaskDescription,
                };
                listOfTask.push(task);
                timesheetFormData.push(getWeekTime(temp));
                uniquePair.push(`${i[key][index].ProjectId}-${i[key][index].TaskType}`);
              } else {
                timesheetFormData[uniquePairIndex][weekDates[dayindex].day] = {
                  hour: getNewValueOnBlur(i[key][index].DurationOfHours.toString()),
                  remark: i[key][index].TaskDescription,
                };
              }
            }
          }
          break;
        case 'SelfLearning':
            if (i[key].length > 0) {
              let project = getSpecificProjectType('self-learning');
              let task = selfLearningList;
              for (let index = 0; index < i[key].length; index++) {
                let temp: any = { isDisabled: true };
                let uniquePairIndex = uniquePair.indexOf(`self-learning-${i[key][index].TaskType}`);
                if (uniquePairIndex === -1) {
                  temp['project'] = project;
                  temp['task'] = { label: i[key][index].TaskType, value: i[key][index].TaskType };
                  temp[weekDates[dayindex].day] = {
                    hour: getNewValueOnBlur(i[key][index].DurationOfHours.toString()),
                    remark: i[key][index]?.TaskDescription ? i[key][index]?.TaskDescription : '',
                  };
                  listOfTask.push(task);
                  timesheetFormData.push(getWeekTime(temp));
                  uniquePair.push(`self-learning-${i[key][index].TaskType}`);
                } else {
                  timesheetFormData[uniquePairIndex][weekDates[dayindex].day] = {
                    hour: getNewValueOnBlur(i[key][index].DurationOfHours.toString()),
                    remark: i[key][index]?.TaskDescription ? i[key][index]?.TaskDescription : '',
                  };
                }
              }
            }
          break;
        case 'remote':
          break;
      }
    }
    dayStatus[dayindex] = {
      TmsStatus: i.TmsStatus === 'submitted' ? 'Submitted' : i.TmsStatus,
      StatusRemark: i.hasOwnProperty('StatusRemark') ? i.StatusRemark : '',
      TmsId: i.TmsId,
      ResubmitStatus: i.ResubmitStatus,
    };
  }
  let totalHours = 0;
  let totalMinutes = 0;
  for (let i of weekDates) {
    i.hour = calculateHourOfDay(i.day, timesheetFormData);
    let [hour, minute] = i.hour.split(':').map(Number);
    totalHours += hour;
    totalMinutes += minute;
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;
  }
  let totalTime = getNewValueOnBlur(totalHours + ':' + totalMinutes);
  for (let row = 0; row < timesheetFormData.length; row++) {
    let totalHoursDay: any = 0;
    let totalMinutesDay = 0;
    for (let time of weekDates) {
      let [hour, minute] = timesheetFormData[row][time.day].hour.split(':').map(Number);
      totalHoursDay += hour;
      totalMinutesDay += minute;
      totalHoursDay += Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
    }
    timesheetFormData[row].totalHour = getNewValueOnBlur(totalHoursDay + ':' + totalMinutesDay);
  }
  return { listOfTask, timesheetFormData, uniquePair, totalTime, dayStatus };
};

const getSpecificProjectType = (key: any) => {
  let project = projectList.find((data: any) => data['value'] === key);
  return project ? project : '';
};

export function convertDateToIST(dateString:any) {
  // Create a new Date object from the input string
  const inputDate = new Date(dateString);
  // Get the offset in minutes and convert it to milliseconds
  const offsetMilliseconds = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istDate = new Date(inputDate.getTime() + offsetMilliseconds);
  return istDate;
}
export function getISTDate(date?:any) {
 return  convertDateToIST(date ? date : new Date());
}