import {
  ScaleFade,
  Box,
  Flex,
  Button,
  Text,
  Grid,
  GridItem,
  Textarea,
  Input,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import { Add, MessageText, Trash, Refresh2 } from 'iconsax-react';
import { useEffect, useRef, useState } from 'react';
import { isAfter, format, isBefore } from 'date-fns';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/app/store';
import ResubmitModal from './resubmitmodal';
import CustomSelect from '@/components/Select';
import { getNewValueOnBlur } from '../../../app/validations/inputTime/inputTime';
import DateHeader from '../Common Component /dateHeader';
import { getWeekDate, getWeekTime, checkCurrentWeek, calculateHourOfDay } from '@/utils/date';
import WeekDateHeader from '../Common Component /weekDateHeaderUI';
import { WeekTime } from '@/utils/dateType';
import { ButtonStatus } from '@/utils/constant';
import StaticRemark from '../Common Component /StaticRemark';
import {
  getTimehseetByDate,
  interviewList,
  testList,
  getTestList,
  getInterviewList,
  getProjectList,
  projectList,
  // otherList,
  // getOtherList,
  supportList,
  getSupportList,
  getSelfLearningList,
  taskType,
  addTimesheetByDate,
  updateEmployTimesheetStatus,
  getProductList,
  getTrainingList,
  productList,
  trainingList,
  selfLearningList
} from '@/utils/timehseetApi';
import { useAppToast } from '@/utils/toastUtil';
import { setLoader } from '@/app/features/loader/loaderSlice';
import ErrorAlert from '@/components/ErrorAlert';
import MonthlyTimesheet from './monthlytimesheet';
import ConfirmationPopup from '@/utils/confirmation';
import CustomModal from '@/utils/modal';
import { zodResolver } from '@hookform/resolvers/zod';
import timesheetSchema from '@/app/validations/week';
import { setToken } from '@/utils/api';
import { convertDateToIST, getISTDate } from '@/utils/timesheet';

const Timesheet = () => {
  useEffect(() => {
    setToken();
  },[])

  const { user } = useAppSelector<any>((state) => state.user);
  const { successToast, errorToast } = useAppToast();
  const [currentMonth,setCurrentMonth] = useState<any>(format(getISTDate(),'yyyy-M'));
  useEffect(() => {
    if(user.hasOwnProperty('DepartmentName') && user.DepartmentName.trim() === 'Engineering Kaizen'){
      getSupportList(user.EmpId, errorToast);
    }
    if(user.hasOwnProperty('DepartmentName') && (user.DepartmentName.trim() === 'ODC' || user.DepartmentName.trim() === 'Engineering Product')){
      getProductList(user.EmpId, errorToast);
    }
    if(user.hasOwnProperty('DepartmentName') && user.DepartmentName.trim() === 'Training'){
      getTrainingList(user.EmpId, errorToast);
    }
    getInterviewList(user.EmpId,errorToast);
    getSelfLearningList(user.EmpId,errorToast);
  },[]);

  useEffect(() => {
    dispatch(setLoader(true));
    getProjectList(user.EmpId,currentMonth,errorToast).then((res) => {
      updateLoader(0, false);
      getTestList(user.EmpId,currentMonth,errorToast);
      getTimesheetData();
    });
    // getOtherList(user.EmpId, errorToast);
  }, [currentMonth]);

  const dispatch = useAppDispatch();
  const [spinner, setSpinner] = useState([true, true]);
  const [alertStatus, setAlertStatus] = useState({ status: false, message: '' });
  const [taskList, setTaskList] = useState<any>([[]]);
  const [activeTab, setActiveTab] = useState('Weekly');
  const [weekDates, setWeekDates] = useState(getWeekDate(getISTDate()));
  const [totalHours, setTotalHours] = useState('00:00');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmationData, setConfirmationData] = useState<any>({ status: false });
  const [resubmitData, setResubmitData] = useState<any>({ status: false });
  const scrollableElementRef = useRef<any>(null);
  const { control, setValue, getValues, reset,handleSubmit,formState:{ errors }, setError, trigger} = useForm<{
    times: WeekTime[];
    dayStatus: string[];
    uniquePairList: string[];
    dayStatusRemark: string[];
    tmsId: string[];
  }>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: {
      times: [getWeekTime()],
      dayStatus: ['', '', '', '', '', '', ''],
      uniquePairList: [''],
      dayStatusRemark: ['', '', '', '', '', '', ''],
      tmsId: ['', '', '', '', '', '', ''],
    },
  });

  const { append, remove, fields } = useFieldArray({
    control,
    name: 'times',
  });
  

  useEffect(() => {
    if (spinner.every((data) => data === false)) {
      if(isBefore(weekDates[6].date, getISTDate()) ||
      checkCurrentWeek(weekDates[0].date, weekDates[6].date)){
      // let preMonth = weekDates[0].date.getMonth()+1;
      // let current= weekDates[6].date.getMonth()+1;
      let preMonth = format(getISTDate(weekDates[0].date),'yyyy-M');
      let current = format(getISTDate(weekDates[6].date),'yyyy-M');
      let month:string = preMonth === current ? preMonth.toString() : (preMonth+','+current).toString()     
      if(month !== currentMonth){
        setCurrentMonth(month)
      }
      else{
        getTimesheetData();
      }
     }
     else{
       setValue(`times`,[getWeekTime()])
     }
    }
  }, [weekDates]);
  
  
  const getTimesheetData = () => {
    dispatch(setLoader(true));
    reset();
    setTotalHours('00:00');
    setTaskList([]);
    const param = {
      emp_id: user.EmpId,
      start_date: format(weekDates[0].date, 'yyyy-MM-dd'),
      end_date: format(weekDates[6].date, 'yyyy-MM-dd'),
    };
    getTimesheet(param);
  };
  

  const setOtherError = (timesheetList:any,popupData:any) => {
    let other:any=[];
    let error = false;
    for(let i = 0;i<timesheetList.length;i++){
      let project_type = timesheetList[i].project.type;
      if(project_type === 'other' && timesheetList[i].task !== '' && other.includes(timesheetList[i].task.trim().toLowerCase())){
        setError(`times.${i}.task`, {
          type: "manual",
          message: "Unique task validation",
        })
        error=true;
      }
      else if(project_type === 'other' && timesheetList[i].task !== ''){
       other.push(timesheetList[i].task.trim().toLowerCase())
      }
    }
    if(!error){
      setConfirmationData(popupData);
      onOpen()
    }
    else{
      setAlertStatus({ status: true, message: 'Kindly enter all mandatory fields, ensuring each entry is unique.' });
      updateAlert(false);
    }
  }



  const transformPayload = (day: any, timesheetList: any) => {
    const req: any = {
      ProjectData: [],
      TestData: [],
      HelpOrProxy: [],
      InterviewsTaken: [],
      OthersData: [],
      SelfLearning: [],
    };
    for (let i = 0; i < timesheetList.length; i++) {
      const project_type = timesheetList[i].project.type;
      const hour = timesheetList[i][day].hour;
      const remark = timesheetList[i][day].remark;
      const project = timesheetList[i].project.value;
      const task = project_type === 'other' ? timesheetList[i].task : timesheetList[i].task.value;
      switch (project_type) {
        case 'interview':
          const interview = { InterviewRound: task, DurationOfHours: hour, TaskDescription: remark };
          req['InterviewsTaken'].push(interview);
          break;
        case 'other':
          const other = { TaskDescription: remark, DurationOfHours: hour, Task: task.trim() };
          req['OthersData'].push(other);
          break;
        case 'test':
          const test = { TestId: task.toString(), DurationOfHours: hour, TaskDescription: remark };
          req['TestData'].push(test);
          break;
        case 'support':
          const support = { ProjectId: project, DurationOfHours: hour };
          if (task.trim() === 'Support-Morning' || task.trim() === 'Support-Night') {
            req['ProjectData'].push({ ...support, TaskDescription: remark, TaskType: task });
          } else if (task.trim() === 'Proxy' || task.trim() === 'Help') {
            req['HelpOrProxy'].push({ ...support, TaskDescription: remark, Type: task });
          }
          break;
        case 'Product':
          const product = { ProjectId: project, DurationOfHours: hour, TaskDescription: remark, TaskType: task };
          req['ProjectData'].push(product);
          break;
        case 'Training':
          const training = { ProjectId: project, DurationOfHours: hour, TaskDescription: remark, TaskType: task };
          req['ProjectData'].push(training);
          break;
        case 'self-learning':
          const selfLearning = { DurationOfHours: hour, TaskDescription: remark, TaskType: task };
          req['SelfLearning'].push(selfLearning);
          break;
        case 'remote':
          break;
      }
    }
    return req;
  };

  const setTimesheetdata = (timesheet: any) => {
    let timesheetFormData: any = [];
    let listOfTask = [];
    let uniquePair: any = [];
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
      setValue(`dayStatus.${dayindex}`, i.TmsStatus === 'submitted' ? 'Submitted' : i.TmsStatus);
      setValue(`dayStatusRemark.${dayindex}`, i.StatusRemark);
      setValue(`tmsId.${dayindex}`, i.TmsId);
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
    setTotalHours(getNewValueOnBlur(totalHours + ':' + totalMinutes));
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
    setTaskList([...listOfTask]);
    setValue(`times`, timesheetFormData);
    setValue(`uniquePairList`, uniquePair);
    dispatch(setLoader(false));
    updateLoader(1, false);
  };

  const updateLoader = (index: any, value: any) => {
    let loader = spinner;
    loader[index] = value;
    setSpinner([...loader]);
  };

  const getSpecificProjectType = (key: any) => {
    let project = projectList.find((data: any) => data['value'] === key);
    return project ? project : '';
  };

  const onSubmit = (day: any, index: any) => {
    closeConfirmationModel();
    const req: any = {
      EmpId: user.EmpId,
      TimeSheetData: {
        CreatedAt: getISTDate(),
        Date: format(weekDates[index].date, 'yyyy-MM-dd'),
        TmsStatus: 'Submitted',
        ...transformPayload(day, getValues(`times`)),
      },
    };
    if (
      Object.keys(req.TimeSheetData).some((data) => {
        return req['TimeSheetData'][data] instanceof Array && req['TimeSheetData'][data].length > 0;
      })
    ) {
      dispatch(setLoader(true));
      addTimesheet(req, index);
    }
  };

  const getTimesheet = async (param: any) => {
    try {
      const response = await getTimehseetByDate(param);
      if (response.data?.status_code === 200) {
        if(response.data.response.length === 0){
          setValue(`times`,[getWeekTime()])
          dispatch(setLoader(false));
          updateLoader(1, false);
        }
        else{
          setTimesheetdata(response.data.response)
        }
      } else if (response.data?.status_code !== 200) {
        errorToast('Error', response.data?.message);
        dispatch(setLoader(false));
        updateLoader(1, false);
      } else {
        dispatch(setLoader(false));
        updateLoader(1, false);
      }
    } catch (error: any) {
      dispatch(setLoader(false));
      updateLoader(1, false);
      errorToast('Error', error?.message?.toString());
    }
  };

  const addTimesheet = async (data: any, index: any) => {
    try {
      const response = await addTimesheetByDate(data);
      if (response.data?.status_code === 200) {
        setValue(`dayStatus.${index}`, 'Submitted');
        successToast('Success', response.data?.message);
        let timesheet = getValues(`times`);
        for (let index = 0; index < timesheet.length; index++) {
          setValue(`times.${index}.isDisabled`, true);
          timesheet[index].isDisabled = true;
        }
        setValue(`times`, timesheet);
      } else {
        errorToast('Error', response.data?.message);
      }
      dispatch(setLoader(false));
    } catch (error: any) {
      dispatch(setLoader(false));
      errorToast('Error', error?.message?.toString());
    }
  };

  const checkALldayInitialHour = (day: string) => {
    const getDayHour: any = getValues('times');
    return getDayHour.every((data: any) => parseFloat(data[day].hour.replace(':', '.')) === 0)
      ? ButtonStatus['Not Filled']
      : ButtonStatus['Submit'];
  };

  const getButtonUI = (day: string, status: string, text: string = '', index: number) => {
    const { bg, color, icon, title } = status ? ButtonStatus[status] : checkALldayInitialHour(day);
    const innerText = (
      <>
        <Text as="span">{icon}</Text>
        <Text as="span" ml="1" color={color} textStyle="rgRegular">
          {title}
        </Text>
      </>
    );

    const remark = (text: any, status: any) => {
      const button =
        status === 'Rejected' ? (
          <Button
            pl="0"
            py="0"
            pt="3"
            variant="ghost"
            onClick={() => {
              onOpen();
              setResubmitData({
                status: true,
                day: day,
                dayIndex: index,
                dateString: weekDates[index].date,
                remark: text,
              });
            }}
          >
            <Box className="popover-resubmit-container">
              <Box className="popover-resubmit-icon">
                <Refresh2 width="14px" height="14px" color="#5A50E0" />
              </Box>
              <Text className="popover-resubmit-text">Resubmit timesheet</Text>
            </Box>
          </Button>
        ) : (
          ''
        );
      return <StaticRemark text={text} button={button} />;
    };

    return (
      <>
        {title === 'Submit' ? (
          <Button
            className={`hoverButton ${title}`}
            // w="96px"
            width="100%"
            borderRadius="6px"
            px="2"
            py="1"
            colorScheme="teal"
            variant="solid"
            bg={bg}
            _hover={{ backgroundColor: bg }}
            onClick={
              handleSubmit(() => { 
              let date = weekDates[index].date;
              let popupData = {
                status: true,
                day,
                index,
                date: `${format(date, 'EEE')},${format(date, 'dd')} ${format(date, 'MMM')} ‘${format(date, 'yyyy')}`,
              }
              
              setOtherError(getValues(`times`),popupData)
              },() => {
                setAlertStatus({ status: true, message: 'Kindly enter all mandatory fields, ensuring each entry is unique.' });
                updateAlert(false);
              })
          }
          >
            {innerText}
          </Button>
        ) : (
          <>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              borderRadius="6px"
              px="2"
              py="1"
              bg={bg}
              className="hoverButton"
            >
              {innerText}
            </Box>
            {(status === 'Rejected' || status === 'Approved') && text.trim().length > 0 ? remark(text, status) : null}
          </>
        )}
      </>
    );
  };

  const handleKeyPress = (e: any, index: any, day: any) => {
    if ((getValues(`times.${index}.${day}.hour`) as string)?.includes(':') && e.charCode === 58) {
      e.preventDefault();
    }
    if ((e.charCode < 48 || e.charCode > 57) && e.charCode != 58) {
      e.preventDefault();
    }
  };

  const updateDayWeekHour = (rowIndex: any, coloumIndex: any, day: any) => {
    const specificDay: any = getValues(`times`);
    const hours = calculateHourOfDay(day, specificDay);
    let totalHoursDay = 0;
    let totalMinutesDay = 0;
    let weekDay: any = updateDayOfWeek(hours, coloumIndex);
    let totalHours = 0;
    let totalMinutes = 0;
    for (let hours of weekDay) {
      let [hour, minute] = hours.hour.split(':').map(Number);
      let [hourDay, minuteDay] = specificDay[rowIndex][hours.day].hour.split(':').map(Number);
      totalHours += hour;
      totalMinutes += minute;
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
      totalHoursDay += hourDay;
      totalMinutesDay += minuteDay;
      totalHoursDay += Math.floor(totalMinutesDay / 60);
      totalMinutesDay %= 60;
    }
    setValue(`times.${rowIndex}.totalHour`, getNewValueOnBlur(totalHoursDay + ':' + totalMinutesDay));
    setWeekDates(weekDay);
    setTotalHours(getNewValueOnBlur(totalHours + ':' + totalMinutes));
  };

  const updateDayOfWeek = (hour: any, coloumIndex: any) => {
    let weekDay: any = weekDates;
    weekDay[coloumIndex].hour = hour;
    return weekDay;
  };

  const getAddNewEntryButton = (status: boolean, callback: () => void) => {
    return (
      <Button
        w="100%"
        bg="neutral.100"
        className={status ? 'add-new-entry' : ''}
        _hover={{ backgroundColor: status ? 'primary.100' : 'neutral.100' }}
        onClick={status ? () => callback() : () => {}}
      >
        <Text as="span" className={status ? 'add-icon' : ''}>
          <Add size="20" color={status ? '#64748B' : '#CBD5E1'} />
        </Text>
        <Text display="none" className={status ? 'add-icon-bold' : ''}>
          <Add size="20" color="#5A50E0" variant="Bold" />
        </Text>
        <Text as="span" ml="2" className={status ? 'add-new-entry-text' : ''} color={status ? '#64748B' : '#CBD5E1'}>
          Add new entry
        </Text>
      </Button>
    );
  };

  const chekAllDaysInitialTime = (index: any) => {
    const getDaysTime: any = getValues(`times.${index}`);
    return weekDates.every(({ day }: { day: any }) => {
      let hour = getDaysTime[day].hour.replace(':', '.');
      return parseFloat(hour) === 0;
    });
  };

  const updateTimesheet = async (data: any) => {
    try {
      const response = await updateEmployTimesheetStatus(data);
      if (response.data?.status_code === 200) {
        getTimesheetData();
        successToast('success', response.data?.message);
      } else {
        errorToast('Error', response.data?.message);
        dispatch(setLoader(false));
      }
    } catch (error: any) {
      dispatch(setLoader(false));
      errorToast('Error', error?.message?.toString());
    }
  };

  const updateTimesheetModal = (data: any, day: any, index: any) => {
    const req: any = {
      EmpId: user.EmpId,
      CreatedAt: getISTDate(),
      TmsId: getValues(`tmsId.${index}`),
      ...transformPayload(day, data),
    };
    if (
      Object.keys(req).some((data) => {
        return req[data] instanceof Array && req[data].length > 0;
      })
    ) {
      dispatch(setLoader(true));
      updateTimesheet(req);
    }
  };

  const modalSubmit = (data: any) => {
    updateTimesheetModal(data, resubmitData.day, resubmitData.dayIndex);
    closeConfirmationModel();
  };

  const getTaskByProjectType = async (e: any, index: any) => {
    if (e.value !== getValues(`times.${index}.project`)?.value) {
      setValue(`uniquePairList.${index}`, '');
      let list = updateTaskOnUniquePairChange(index);
      setValue(`times.${index}.project`, e);
      setValue(`times.${index}.task`, '');
      let response: any = taskType[e.type].length > 0 ? taskType[e.type] : [];
      let specificList = [];
      for (let i of response)
        specificList.push({
          ...i,
          isDisabled: getValues(`uniquePairList`).includes(getValues(`times.${index}.project`).value + '-' + i.value),
        });
      list[index] = specificList;
      setTaskList(list);
    }
  };

  const taskChange = (e: any, index: any) => {
    if (e.value !== getValues(`times.${index}.task`).value) {
      setValue(`times.${index}.task`, e);
      setValue(`uniquePairList.${index}`, getValues(`times.${index}.project`).value + '-' + e.value);
      let list = updateTaskOnUniquePairChange(index);
      setTaskList([...list]);
    }
  };

  const updateTaskOnUniquePairChange = (index: any, status?: any) => {
    let list = [];
    for (let task = 0; task < taskList.length; task++) {
      if (
        !getValues(`times.${task}.isDisabled`) &&
        getValues(`times.${task}.project`).value === getValues(`times.${index}.project`).value
      ) {
        let optionList = [];
        for (let i of taskList[task]) {
          optionList.push({
            ...i,
            isDisabled: getValues(`uniquePairList`).includes(getValues(`times.${task}.project`).value + '-' + i.value),
          });
        }
        list.push(optionList);
      } else {
        list.push(taskList[task]);
      }
    }
    return list;
  };

  const removeUniquePair = (index: any) => {
    let temp = getValues(`uniquePairList`);
    temp.splice(index, 1);
    setValue(`uniquePairList`, temp);
    let list = updateTaskOnUniquePairChange(index, 'delete');
    list.splice(index, 1);
    setTaskList([...list]);
    remove(index);
  };

  const updateAlert = (status: any) => {
    setTimeout(() => setAlertStatus({ ...alertStatus, status }), 1500);
  };

  const closeConfirmationModel = () => {
    setConfirmationData({ status: false });
    setResubmitData({ status: false });
    onClose();
  };


  const getTaskTypeUI = (field:any,index:any) => {
   return getValues(`times.${index}.project`).type === 'other' ? (
     <Input height='100%'
     {...field} 
      color="#64748B"
      border={`1px solid  ${ errors.times && errors.times[index] && errors.times[index]?.task ? '#E54848' :'#F1F5F9'}`}
      placeholder="Enter Text" borderRadius={'12px'}
     _focusWithin={{border: `1px solid ${ errors.times && errors.times[index] && errors.times[index]?.task ? '#E54848' :'#64748B!important'}`}}
     _hover={{ border: `1px solid ${ errors.times && errors.times[index] && errors.times[index]?.task ? '#E54848' :'#D6D3FD'}`}}  
     _focusVisible={{ boxShadow: 'none' }}
     _placeholder={{ color: '#94A3B8' }}
     _disabled={{color:'#64748B',borderColor:'#F1F5F9'}}
      disabled={getValues(`times.${index}.isDisabled`)}
     />
   ) : (
     <CustomSelect
       {...field}
       errorClass = {getValues(`times.${index}.task`) === '' && errors.times && errors.times[index] && errors.times[index]?.task ? 'error-timesheet' : ''}
       isDisabled={getValues(`times.${index}.isDisabled`)}
       placeholder="Select task"
       onChange={(e: any) => {
         taskChange(e, index);
       }}
       options={[
         {
           label: 'Task',
           options: taskList[index]  ? taskList[index] :[],
         },
       ]}
       color="#64748B"
     />
   );
  } 

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollableElementRef.current) {
        scrollableElementRef.current.scrollTop = scrollableElementRef.current.scrollHeight;
      }
    },200);
  };

  return (
    <ScaleFade in initialScale={0.6}>
      {spinner.every((data) => data === false) ? (
        <>
          <Box px="6">
            {alertStatus.status ? <ErrorAlert message={alertStatus.message} /> : null}
            <Box>
              <DateHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                weekDates={weekDates}
                setWeekDates={setWeekDates}
              />
            </Box>
            {activeTab === 'Monthly' ? (
              <MonthlyTimesheet />
            ) : (
              <Box pt="32px">
                <WeekDateHeader weekDates={weekDates} totalHours={totalHours} />
                <Box display={'flex'} flexDirection={'column'} h="calc(100vh - 244px)">
                  <Box  ref={scrollableElementRef} style={getValues(`times`).length > 9 ? { overflowY: 'auto', height: 'auto' } : {}}>
                    {/* onSubmit={handleSubmit(onSubmit)} */}
                    <form>
                      {fields.map((time: any, index: number) => (
                        <Flex mb="2" key={time.id} className="hourRows">
                          <Box w="38%">
                            <Flex h="100%">
                              <Box w="40%" h="100%">
                                <Controller
                                  name={`times.${index}.project`}
                                  control={control}
                                  render={({ field }) => (
                                    <CustomSelect
                                      errorClass = {getValues(`times.${index}.project`) === '' && errors.times && errors.times[index] && errors.times[index]?.project ? 'error-timesheet' : ''}
                                      // style={ errors.times && errors.times[index] && errors.times[index]?.project ? {'border':'1px solid #E54848'} : {}}
                                      isDisabled={getValues(`times.${index}.isDisabled`)}
                                      {...field}
                                      placeholder="Select project"
                                      options={[
                                        {
                                          label: 'Your Projects/Clients',
                                          options: projectList,
                                        },
                                      ]}
                                      onChange={(e: any) => {
                                        getTaskByProjectType(e, index);
                                      }}
                                      color="#1E293B"
                                    />
                                  )}
                                />
                              </Box>
                              <Box w="60%" ml="2" h="100%">
                                <Controller
                                  name={`times.${index}.task`}
                                  control={control}
                                  render={({ field }) => getTaskTypeUI(field,index)}
                                />
                              </Box>
                            </Flex>
                          </Box>
                          <Box w="62%" ml="4">
                            <Grid templateColumns="repeat(8,minmax(96px, 1fr)) 28px" gap={2}>
                              {weekDates.map(
                                ({ date, hour, day }: { date: any; hour: any; day: any }, dayIndex: any) => (
                                  <GridItem className="gridItem" position={'relative'} colSpan={1} key={dayIndex}>
                                    {getValues(`times`).length >= 8 &&
                                    getValues(`times`).length - 4 <= index &&
                                    !isAfter(date, getISTDate()) ? (
                                      <Box
                                        pb="5px"
                                        className="inputTextArea"
                                        top="-213px"
                                        zIndex="9999"
                                        position="absolute"
                                      >
                                        <Box
                                          w="287px"
                                          h="207px"
                                          px="14px"
                                          pb="4"
                                          pt="10px"
                                          bg="white"
                                          boxShadow="0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)"
                                          borderRadius="xl"
                                          border="1px solid #F1F5F9"
                                        >
                                          <Box display="flex">
                                            <Text as="span">
                                              <MessageText size="16" color="#D97706" />
                                            </Text>
                                            <Text ml="6px" as="span" color="warning.400" textStyle="smMedium">
                                              Remark
                                            </Text>
                                          </Box>
                                          <Box
                                            mt="6px"
                                            p="2"
                                            borderRadius="10px"
                                            border="1px solid #F1F5F9"
                                            outline="0px"
                                          >
                                            <Controller
                                              render={({ field }) => (
                                                <Textarea
                                                  {...field}
                                                  readOnly={getValues(`dayStatus.${dayIndex}`) === 'Submitted'}
                                                  className="inputTextAreaField"
                                                  h="139px"
                                                  p="0"
                                                  border="none"
                                                  outline="none"
                                                  color="neutral.700"
                                                  textStyle="rgRegular"
                                                  resize="none"
                                                  _focusVisible={{ borderColor: 'transparent', boxShadow: 'none' }}
                                                ></Textarea>
                                              )}
                                              name={`times.${index}.${day}.remark`}
                                              control={control}
                                            />
                                          </Box>
                                        </Box>
                                      </Box>
                                    ) : null}
                                    <Controller
                                      render={({ field }) => (
                                        <Input
                                          {...field}
                                          readOnly={
                                            getValues(`dayStatus.${dayIndex}`) === 'Submitted' ||
                                            getValues(`dayStatus.${dayIndex}`) === 'Approved' ||
                                            getValues(`dayStatus.${dayIndex}`) === 'Rejected'
                                          }
                                          className="inputField"
                                          placeholder="00:00"
                                          p="3"
                                          h="46px"
                                          cursor="pointer"
                                          bg="neutral.100"
                                          fontSize="14px"
                                          border="none"
                                          outline="none"
                                          color={
                                            isAfter(date, getISTDate())
                                              ? 'neutral.300'
                                              : getValues(`times.${index}.${day}.hour`) === '00:00'
                                              ? 'neutral.500'
                                              : 'neutral.700'
                                          }
                                          textStyle="rgRegular"
                                          resize="none"
                                          textAlign="center"
                                          _hover={{
                                            backgroundColor: isAfter(date, getISTDate()) ? 'neutral.100' : 'neutral.200',
                                          }}
                                          _focus={
                                            !isAfter(date, getISTDate())
                                              ? {
                                                  backgroundColor: 'primary.100',
                                                  border: '1px solid #5A50E0',
                                                  color: 'neutral.700',
                                                }
                                              : {}
                                          }
                                          _disabled={{
                                            opacity: 1,
                                          }}
                                          maxLength={5}
                                          minLength={4}
                                          onKeyPress={(e) => handleKeyPress(e, index, day)}
                                          onFocus={() => {
                                            if (
                                              getValues(`dayStatus.${dayIndex}`) !== 'Submitted' &&
                                              (getValues(`times.${index}.${day}.hour`) as string) === '00:00'
                                            ) {
                                              setValue(`times.${index}.${day}.hour`, '' as never);
                                            }
                                          }}
                                          onBlur={(e: any) => {
                                            let hour = e.target.value;
                                            setValue(
                                              `times.${index}.${day}.hour`,
                                              (hour.length > 0 ? getNewValueOnBlur(hour) : '00:00') as never,
                                            );
                                            updateDayWeekHour(index, dayIndex, day);
                                          }}
                                          onChange={(e) => {
                                            let hour = e.target.value;
                                            if (
                                              (getValues(`times.${index}.${day}.hour`) as string).includes(':') &&
                                              !hour.includes(':') &&
                                              (getValues(`times.${index}.${day}.hour`) as string).split(':')[1].length >
                                                0
                                            ) {
                                              return;
                                            }
                                            if (
                                              parseInt(hour) < 13 &&
                                              !hour.includes(':') &&
                                              hour.length >= 2 &&
                                              (getValues(`times.${index}.${day}.hour`) as string).length < hour.length
                                            ) {
                                              setValue(
                                                `times.${index}.${day}.hour`,
                                                (hour.slice(0, 2) + ':' + hour.slice(2)) as never,
                                              );
                                              return;
                                            }
                                            if (
                                              (parseInt(hour) > 12.59 ||
                                                (hour.includes(':') && parseInt(hour.split(':')[1]) > 59)) &&
                                              (getValues(`times.${index}.${day}.hour`) as string).length < hour.length
                                            ) {
                                              setValue(
                                                `times.${index}.${day}.hour`,
                                                getValues(`times.${index}.${day}.hour`),
                                              );
                                              return;
                                            }
                                            if (
                                              hour.includes(':') &&
                                              (hour.split(':')[0].length > 2 || hour.split(':')[1].length > 2)
                                            ) {
                                              return;
                                            }
                                            setValue(`times.${index}.${day}.hour`, hour as never);
                                          }}
                                          _focusVisible={{ boxShadow: 'none' }}
                                          // defaultValue={`times.${index}.${day}.hour`}
                                          disabled={isAfter(date, getISTDate())}
                                        ></Input>
                                      )}
                                      name={`times.${index}.${day}.hour`}
                                      control={control}
                                    />
                                    {(getValues(`times`).length < 8 || getValues(`times`).length - 4 > index) &&
                                    !isAfter(date, getISTDate()) ? (
                                      <Box pt="5px" className="inputTextArea" zIndex="9999" position="absolute">
                                        <Box
                                          w="287px"
                                          h="207px"
                                          px="14px"
                                          pb="4"
                                          pt="10px"
                                          bg="white"
                                          boxShadow="0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)"
                                          borderRadius="xl"
                                          border="1px solid #F1F5F9"
                                        >
                                          <Box display="flex">
                                            <Text as="span">
                                              <MessageText size="16" color="#D97706" />
                                            </Text>
                                            <Text ml="6px" as="span" color="warning.400" textStyle="smMedium">
                                              Remark
                                            </Text>
                                          </Box>
                                          <Box
                                            mt="6px"
                                            p="2"
                                            borderRadius="10px"
                                            border="1px solid #F1F5F9"
                                            outline="0px"
                                          >
                                            <Controller
                                              render={({ field }) => (
                                                <Textarea
                                                  {...field}
                                                  readOnly={getValues(`dayStatus.${dayIndex}`) === 'Submitted'}
                                                  className="inputTextAreaField"
                                                  h="139px"
                                                  p="0"
                                                  border="none"
                                                  outline="none"
                                                  color="neutral.700"
                                                  textStyle="rgRegular"
                                                  resize="none"
                                                  _focusVisible={{ borderColor: 'transparent', boxShadow: 'none' }}
                                                ></Textarea>
                                              )}
                                              name={`times.${index}.${day}.remark`}
                                              control={control}
                                            />
                                          </Box>
                                        </Box>
                                      </Box>
                                    ) : null}
                                  </GridItem>
                                ),
                              )}
                              <GridItem colSpan={1}>
                                <Box p="3">
                                  <Text as="h6" textAlign="center" color="primary.500" textStyle="rgRegular">
                                    {getValues(`times.${index}.totalHour`)}
                                  </Text>
                                </Box>
                              </GridItem>
                              <GridItem colSpan={1}>
                                <Box
                                  w="28px"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  h="100%"
                                  className="deleteIcon"
                                >
                                  {getValues('times').length > 1 && chekAllDaysInitialTime(index) ? (
                                    <Icon
                                      onClick={() => {
                                        removeUniquePair(index);
                                      }}
                                      p="6px"
                                      w="28px"
                                      h="28px"
                                      cursor="pointer"
                                      as={Trash}
                                      color="neutral.500"
                                      _hover={{ color: 'error.300', backgroundColor: 'error.100', borderRadius: 'lg' }}
                                    />
                                  ) : null}
                                </Box>
                              </GridItem>
                            </Grid>
                          </Box>
                        </Flex>
                      ))}
                    </form>
                  </Box>
                  <Flex>
                    <Box w="38%">
                      <Flex>
                        {getAddNewEntryButton(
                          isBefore(weekDates[6].date, getISTDate()) ||
                            checkCurrentWeek(weekDates[0].date, weekDates[6].date),
                          () => {
                            append(getWeekTime());
                            setTaskList([...taskList, []]);
                            setValue(`uniquePairList`, [...getValues(`uniquePairList`), '']);
                            scrollToBottom();
                          },
                        )}
                      </Flex>
                    </Box>
                    <Box w="62%" ml="4" alignItems="center" my="auto">
                      <Grid templateColumns="repeat(8,minmax(96px, 1fr)) 28px" gap={2}>
                        {/* w="96px" */}
                        {weekDates.map(({ date, hour, day }: { date: any; hour: any; day: any }, dayIndex) => (
                          <GridItem colSpan={1} key={dayIndex}>
                            {isAfter(getISTDate(), date) ? (
                              getButtonUI(
                                day,
                                getValues(`dayStatus.${dayIndex}`),
                                getValues(`dayStatusRemark.${dayIndex}`),
                                dayIndex,
                              )
                            ) : (
                              <Box p="3"></Box>
                            )}
                          </GridItem>
                        ))}
                        <GridItem colSpan={1}>
                          <Box p="3"></Box>
                        </GridItem>
                        <GridItem colSpan={1}></GridItem>
                      </Grid>
                    </Box>
                  </Flex>
                </Box>
              </Box>
            )}
          </Box>

          {resubmitData.status ? (
            <CustomModal
              isOpen={isOpen && resubmitData.status}
              size="xl"
              onClose={closeConfirmationModel}
              title={<Text className="resubmit-modal-heading">Resubmit timesheet</Text>}
              Component={
                <ResubmitModal
                  onClose={closeConfirmationModel}
                  dayIndex={resubmitData.dayIndex}
                  day={resubmitData.day}
                  dateString={resubmitData.dateString}
                  hour={weekDates[resubmitData.dayIndex].hour}
                  remark={resubmitData.remark}
                  chekAllDaysInitialTime={chekAllDaysInitialTime}
                  getAddNewEntryButton={getAddNewEntryButton}
                  dayList={getValues('times')}
                  uniqueList={getValues(`uniquePairList`)}
                  getWeekTime={getWeekTime}
                  handleKeyPress={handleKeyPress}
                  modalSubmit={modalSubmit}
                  taskList={taskList}
                />
              }
            />
          ) : null}
          {confirmationData.status ? (
            <CustomModal
              isOpen={isOpen && confirmationData.status}
              size="md"
              onClose={closeConfirmationModel}
              Component={
                <ConfirmationPopup
                  date={confirmationData.date}
                  close={() => closeConfirmationModel()}
                  success={() => {
                    onSubmit(confirmationData.day, confirmationData.index);
                  }}
                />
              }
            />
          ) : null}
        </>
      ) : null}
    </ScaleFade>
  );
};
export default Timesheet;



