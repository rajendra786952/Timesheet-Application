import { Flex, GridItem, Grid, Text, Center, Box, Input, Icon, Textarea, Button } from '@chakra-ui/react';
import { Controller, useFieldArray, useForm, useFormContext, useWatch } from 'react-hook-form';
import { isAfter,  format } from 'date-fns';
import { Calendar, MessageText, Trash } from 'iconsax-react';
import { useEffect, useState } from 'react';
import CustomSelect from '@/components/Select';
import { getNewValueOnBlur }  from '../../../app/validations/inputTime/inputTime';
import { Option, WeekTime } from '@/utils/dateType';
import { projectList, taskType } from '@/utils/timehseetApi';
import { calculateHourOfDay } from '@/utils/date';
import { zodResolver } from '@hookform/resolvers/zod';
import timesheetSchema from '@/app/validations/week';
import { getISTDate } from '@/utils/timesheet';



const ResubmitModal = ({
  hour,
  getAddNewEntryButton,
  dayList,
  getWeekTime,
  handleKeyPress,
  modalSubmit,
  day,
  onClose,
  dateString,
  taskList,
  remark,
  uniqueList,
}: any) => {
  const date = getISTDate();
  const { control, handleSubmit, setValue, getValues,formState:{ errors } , setError, trigger } = useForm<{
    times: WeekTime[];
    dayStatus: string[];
    uniquePairList: string[];
    dayStatusRemark: string[];
    tmsId: string[];
  }>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: {
      times: dayList,
      uniquePairList:uniqueList,
      dayStatus: ['', '', '', '', '', '', ''],
      dayStatusRemark: ['', '', '', '', '', '', ''],
      tmsId: ['', '', '', '', '', '', ''],
    },
  });
  const [totalhours, setTotalHours] = useState(hour);
  const { append, remove,fields } = useFieldArray({
    control,
    name: 'times',
  });
  const [taskDayList,setTaskDayList]=useState(taskList)
 
  useEffect(() => {
    setInitialTaskWithUnique();
  },[])

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
      setTaskDayList(list);
      trigger(`times.${index}.project`);
    }
  }; 

  const setInitialTaskWithUnique = () => {
    let list =[];
    for(let task=0;task<taskDayList.length;task++){
        let optionList=[];
        for(let i of taskDayList[task]){
         optionList.push({...i,isDisabled: getValues(`uniquePairList`).includes(getValues(`times.${task}.project`).value+'-'+i.value)})
        }
        list.push(optionList);
    }
    setTaskDayList(list);
  }

  const updateTaskOnUniquePairChange = (index:any,status?:any) => {
    let list=[]
    for(let task=0;task<taskDayList.length;task++){
      if(getValues(`times.${task}.project`).value === getValues(`times.${index}.project`).value){
        let optionList=[];
        for(let i of taskDayList[task]){
         optionList.push({...i,isDisabled: getValues(`uniquePairList`).includes(getValues(`times.${task}.project`).value+'-'+i.value)})
        }
        list.push(optionList);
      }
      else{
        list.push(taskDayList[task])
      }
    }
    return list;
  }

  const taskChange = (e:any,index:any) => {
    if(e.value !== getValues(`times.${index}.task`).value){
      setValue(`times.${index}.task`,e)
      setValue(`uniquePairList.${index}`,getValues(`times.${index}.project`).value+'-'+e.value);
      let list = updateTaskOnUniquePairChange(index);
      setTaskDayList([...list]);
      trigger(`times.${index}.task`)
    }
  }

  const removeUniquePair = (index:any) => {
    let temp = getValues(`uniquePairList`);
    temp.splice(index,1);
    setValue(`uniquePairList`,temp);
    let list = updateTaskOnUniquePairChange(index,'delete');
    list.splice(index,1);
    setTaskDayList([...list]);
    remove(index);
  }

  const getTaskTypeUI = (field:any,index:any) => {
    return getValues(`times.${index}.project`).value === 'other' ? (
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
      //disabled={getValues(`times.${index}.isDisabled`)}
      onChange={(e) => {
        setValue(`times.${index}.task`,e.target.value)
        trigger(`times.${index}.task`)
      } }
      />
    ) : (
      <CustomSelect
        {...field}
        errorClass = {getValues(`times.${index}.task`) === '' && errors.times && errors.times[index] && errors.times[index]?.task ? 'error-timesheet' : ''}
       // isDisabled={getValues(`times.${index}.isDisabled`)}
        placeholder="Select task"
        onChange={(e: any) => {
          taskChange(e, index);
        }}
        options={[
          {
            label: 'Task',
            options: taskDayList[index] ? taskDayList[index] : [],
          },
        ]}
        color="#64748B"
      />
    );
   } 

   const setOtherError = (timesheetList:any) => {
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
    if(Object.keys(errors).length === 0 && !error){
      modalSubmit(getValues(`times`))
    }
  }

 
  return (
    <Box py="4" px="5">
      <Box className="modal-date-status-container" mb="2">
        <Flex direction="row" className="modal-date-container">
          <Flex w="20px" h="20px">
            <Calendar color="#94A3B8" />
          </Flex>
          <Flex direction="column">
            <Box>
              <Text as="span" className="modal-date-heading">
                Date
              </Text>
            </Box>
            <Box className="modal-date-value">
              {[format(dateString, 'EEE') + ',', format(dateString, 'dd'), format(dateString, 'MMM')].join(' ')}
            </Box>
          </Flex>
        </Flex>
        <Flex direction="row" className="modal-status-container">
          <Flex w="20px" h="20px">
            <MessageText color="#94A3B8" />
          </Flex>
          <Flex direction="column">
            <Flex className="modal-status-heading">Rejected :: Remark</Flex>
            <Flex className="modal-status-value">{remark}</Flex>
          </Flex>
        </Flex>
      </Box>
      <Flex mb="4" gap="8px" className="background">
        <Box w="76%" pb="6px">
          <Flex h="100%">
            <Box w="40%" px="2" display="flex" flexDirection="column-reverse">
              <Text as="span" color="neutral.600" textStyle="rg1SemiBold">
                Project/Client
              </Text>
            </Box>
            <Box w="60%" ml="4" px="2" display="flex" flexDirection="column-reverse">
              <Text as="span" color="neutral.600" textStyle="rg1SemiBold">
                TASK
              </Text>
            </Box>
          </Flex>
        </Box>
        <Box w="24%" ml="4">
          <Grid templateColumns="repeat(1,minmax(96px, 1fr)) 28px" gap={2}>
            <GridItem colSpan={1} px="2" pb="1" pt="6px" bg={'transparent'} borderRadius="lg">
              <Box>
                {/* w="80px" */}
                <Center>
                  <Text className="total-hours-heading-modal">Total hours</Text>
                </Center>
              </Box>
              <Box mt="2px">
                <Center>
                  <Text className="total-hours-modal-value">{totalhours}</Text>
                </Center>
              </Box>
            </GridItem>
            <GridItem>
              <Box w="28px" display="flex" alignItems="center" justifyContent="center" h="100%"></Box>
            </GridItem>
          </Grid>
        </Box>
      </Flex>
      <form>
        {fields.map((time: any, index: number) => (
          <Flex mb="2" key={time.id} className="hourRows">
            <Box w="76%">
              <Flex h="100%">
                <Box w="40%" h="100%">
                  <Controller
                    name={`times.${index}.project`}
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        {...field}
                        errorClass = {getValues(`times.${index}.project`) === '' && errors.times && errors.times[index] && errors.times[index]?.project ? 'error-timesheet' : ''}
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
                    render={({ field }) => getTaskTypeUI(field, index)}
                  />
                </Box>
              </Flex>
            </Box>
            <Box w="24%" ml="4">
              <Grid templateColumns="repeat(2,minmax(96px, 1fr))" gap={2}>
                <GridItem colSpan={1}>
                  <Box borderRadius="lg">
                    <Controller
                      render={({ field }) => (
                        <Input
                          {...field}
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
                            if ((getValues(`times.${index}.${day}.hour`) as string) === '00:00') {
                              setValue(`times.${index}.${day}.hour`, '' as never);
                            }
                          }}
                          onBlur={(e: any) => {
                            let hour = e.target.value;
                            setValue(
                              `times.${index}.${day}.hour`,
                              (hour.length > 0 ? getNewValueOnBlur(hour) : '00:00') as never,
                            );
                            setTotalHours(calculateHourOfDay(day, getValues(`times`)));
                          }}
                          onChange={(e) => {
                            let hour = e.target.value;
                            if (
                              (getValues(`times.${index}.${day}.hour`) as string).includes(':') &&
                              !hour.includes(':') &&
                              (getValues(`times.${index}.${day}.hour`) as string).split(':')[1].length > 0
                            ) {
                              return;
                            }
                            if (
                              parseInt(hour) < 13 &&
                              !hour.includes(':') &&
                              hour.length >= 2 &&
                              (getValues(`times.${index}.${day}.hour`) as string).length < hour.length
                            ) {
                              setValue(`times.${index}.${day}.hour`, (hour.slice(0, 2) + ':' + hour.slice(2)) as never);
                              return;
                            }
                            if (
                              (parseInt(hour) > 12.59 || (hour.includes(':') && parseInt(hour.split(':')[1]) > 59)) &&
                              (getValues(`times.${index}.${day}.hour`) as string).length < hour.length
                            ) {
                              setValue(`times.${index}.${day}.hour`, getValues(`times.${index}.${day}.hour`));
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
                        <Box mt="6px" p="2" borderRadius="10px" border="1px solid #F1F5F9" outline="0px">
                          <Controller
                            render={({ field }) => (
                              <Textarea
                                {...field}
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
                    {getValues('times').length > 1 ? (
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
      <Box w="100%" gap="8px">
        <Flex>
          {getAddNewEntryButton(true, () => {
            append(getWeekTime());
          })}
        </Flex>
      </Box>
      {
        Object.keys(errors).length > 0 ? 
        (
          <Box pt='4'>
            <Text as='span' color='error.300' textStyle={'rgMedium'}>
             Kindly enter all mandatory fields, ensuring each entry is unique.
            </Text>
          </Box>
        )
        :
        null
      }
      <Box className="modal-buttons-container-outer" px="1" pb="0">
        <Box className="modal-buttons-container">
          <Button className="modal-discard-button" onClick={() => onClose()}>
            <Box className="modal-discard-button-text">Discard</Box>
          </Button>
          <Button className="modal-resubmit-button">
            <Box className="modal-resubmit-button-text" onClick={
              handleSubmit(
              () => {
                setOtherError(getValues(`times`))
               },() => {
                 console.log('validation error')
                })
               }>
              Resubmit
            </Box>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ResubmitModal;
