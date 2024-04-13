import { Box, Flex, Grid, GridItem, ScaleFade, Text, Input, Textarea, Center, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, Spacer} from "@chakra-ui/react";
import DateHeader from "../Common Component /dateHeader";
import UserDetail from "./userDetailCard";
import {  checkCurrentWeek, getPendingWeekDates, getWeekDate,  getWeekTime } from "@/utils/date";
import { useEffect,  useState } from "react";
import WeekDateHeader from "../Common Component /weekDateHeaderUI";
import CustomSelect from "@/components/Select";
import { PROJECTLIST } from "@/utils/constant";
import { addDays, format, isAfter, isBefore, isWithinInterval } from "date-fns";
import { CloseSquare, Dislike, Like1, MessageText } from "iconsax-react";
import StaticRemark from "../Common Component /StaticRemark";
import ApproveReject from "./ApproveRejectModal";
import { getProjectList, getTimehseetByDate, updateTimesheetStatus } from "@/utils/timehseetApi";
import { useAppToast } from "@/utils/toastUtil";
import { getISTDate, setTimesheetApiData } from "@/utils/timesheet";
import { setLoader } from "@/app/features/loader/loaderSlice";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { useNavigate, useParams } from "react-router-dom";
import MonthlyTimesheet from "../User timesheet/monthlytimesheet";
import { setEmploy } from "@/app/features/employ/employSlice";
import { setToken } from "@/utils/api";



const UserTimesheet= () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { EmpId } = useParams();
    const { employ } = useAppSelector<any>((state) => state.employ);
    const { user } = useAppSelector<any>((state) => state.user);
    const [currentMonth,setCurrentMonth] = useState<any>(format(getISTDate(),'yyyy-M'));
    const [pendingWeekDate,setPendingWeekDate] = useState(employ.hasOwnProperty('PendingDates') && employ.PendingDates.length > 0 ? getPendingWeekDates(employ.PendingDates) :[]);
    const [pendingDates,setPendingDates] = useState<any>(employ.hasOwnProperty('PendingDates')? employ.PendingDates :[]);
    const getPendingDate = () => {
      let length = pendingDates.length;
     return length > 0 ? getISTDate(pendingDates[length - 1]) : getISTDate()
    }
    const { successToast, errorToast } = useAppToast();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [activeTab, setActiveTab] = useState('Weekly');
    const [weekDates, setWeekDates] = useState(getWeekDate(getPendingDate()));
    const [totalHours, setTotalHours] = useState('00:00');
    const [weekActivityList, setWeekActivityList] = useState<any>([]);
    const [dayStatus,setDayStatus] = useState<any>([
      // {status:'Reject',remark:'You missed one task'},{status:'Approve',remark:'I approve'},null,null,null,null,null
    ])
    const [iconType,setIconType] = useState<any>(Array(7).fill([{type:"Linear",color:'#8ED7C0'},{type:"Linear",color:'#F5BDBD'}]))
    const [modalData,setModalData]= useState<any>({});
    const [spinner,setSpinner] = useState([true,true]);
    const [currentIndex,setCurrentIndex] = useState<any>(pendingWeekDate.length - 1);
    const[currentIndexStatus,setCurrentIndexStatus] = useState<any>(true)
   
    useEffect(() => {
    if(Object.keys(employ).length === 0 || (employ.EmpId.toString() !== EmpId?.toString())){
      navigate('manager')
     }
   },[])

   useEffect(() => {
    setToken();
   },[])

    const getRemark = (data: any) => {
      return data.hasOwnProperty('StatusRemark') && data.StatusRemark.trim().length > 0  ? (
        <StaticRemark text = {data.StatusRemark} button={null}  />
      ) : null;
    };
   
    useEffect(() => {
      getProjectList(EmpId,currentMonth,errorToast).then((res) => {
        updateLoader(0,false);
        getTimesheetData();
      });
    },[currentMonth])

   const openModal = (data:any) => {
    setModalData({...data,EmpId:user.EmpId})
    onOpen()
   }
  
   const closeModal = () => {
    setModalData({})
    onClose()
   }

   const submitModal = (data:any) => {
     dispatch(setLoader(true));
     updateStatus(data,modalData.date);
     setModalData({})
     onClose()
   }
   
   const updateStatus = async (data: any, date: any) => {
     try {
       const response = await updateTimesheetStatus(data);
       if (response.data?.status_code === 200) {
         successToast('Success', `Timesheet has been successfully ${data.TmsStatus.toLowerCase()}.`);
         let index = pendingDates.indexOf(format(date, 'yyyy-MM-dd'));
         let PendingDates = [...pendingDates];
         PendingDates.splice(index, 1);
         if (PendingDates.some((date: any) => checkCurrentWeekDate(getISTDate(date)))) {
           getTimesheetData();
         } else {
           let pendingWeekIndex = pendingWeekDate.indexOf(format(weekDates[0].date, 'yyyy-MM-dd'));
           if (pendingWeekIndex !== -1) {
             let pendingWeek = [...pendingWeekDate];
             pendingWeek.splice(pendingWeekIndex, 1);
             setPendingWeekDate(pendingWeek);
             if (pendingWeekIndex > 0) {
               setCurrentIndex(currentIndex - 1);
               setWeekDates(getWeekDate(getISTDate(pendingWeek[currentIndex - 1])));
             }
             if (pendingWeek.length > 0 && pendingWeekIndex === 0) {
               setWeekDates(getWeekDate(getISTDate(pendingWeek[currentIndex])));
             }
            if(pendingWeek.length === 0){
              setWeekDates(getWeekDate(getISTDate()));
            }
           }
         }
         setPendingDates(PendingDates);
         dispatch(setEmploy({ ...employ, PendingDates }));
       } else {
         errorToast('Error', response.data?.message);
       }
       dispatch(setLoader(false));
     } catch (error: any) {
       dispatch(setLoader(false));
       errorToast('Error', error?.message?.toString());
     }
   };

   const updateLoader = (index:any,value:any) => {
    let loader = spinner;
    loader[index]=value;
    setSpinner([...loader]);
   }  

   useEffect(() => {
    if(spinner.every((data) => data === false)){
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
      setWeekActivityList([getWeekTime()])
    }
    }
   }, [weekDates]);
   
   useEffect(() => {
    if(spinner.every((data) => data == false) && !currentIndexStatus && currentIndex > -1){
      let date = pendingWeekDate[currentIndex];
      setWeekDates(getWeekDate(getISTDate(date)));
      setCurrentIndexStatus(true)
    }
  },[currentIndex])
  
    const getTimesheetData = () => {
      dispatch(setLoader(true));
      setTotalHours('00:00');
      setWeekActivityList([]);
      const param = {emp_id:EmpId,start_date: format(weekDates[0].date,'yyyy-MM-dd'),end_date:format(weekDates[6].date,'yyyy-MM-dd')}
      getTimesheet(param);
    }

   const getTimesheet = async (param:any) => {
    try{
      const response = await getTimehseetByDate(
         param
        );
      if(response.data?.status_code === 200 && response.data.response.length > 0){
       const { timesheetFormData, totalTime,dayStatus }  = setTimesheetApiData(response.data.response,weekDates);
       setWeekActivityList(timesheetFormData);
       setTotalHours(totalTime);
       setDayStatus(dayStatus);
       }
       else if(response.data?.status_code !== 200){
        errorToast('Error', response.data?.message)
       }
       else{
        setWeekActivityList([getWeekTime()]);
        setTotalHours('00:00');
        setDayStatus(new Array(7).fill({ TmsStatus: '', remark: '' }));
       }
       updateLoader(1,false)
       dispatch(setLoader(false));
     }
     catch(error:any){
      dispatch(setLoader(false))
      updateLoader(1,false)
      errorToast('Error', error?.message?.toString());
     }
   };   
  
  const updateIcon = (index:number,iconIndex:number,data:any) => {
   if(iconType[index][iconIndex].color !== data.color){
    let temp=[...iconType];
    let statusType = [...temp[index]];
    statusType[iconIndex]=data;
    temp[index] = statusType;
    setIconType(temp)
   }
  }

  const checkCurrentWeekDate = (date:any) =>{
    return isWithinInterval(date, {
      start: weekDates[0].date,
      end: addDays(weekDates[6].date,1),
    });
  }


   return (
     <ScaleFade in initialScale={0.6}>
       {spinner.every((data) => data === false) ? (
         <>
           <Box px="6">
             <Box my="2">
               <UserDetail employ={employ} />
             </Box>
             <Box my="4">
               <Box>
                 <DateHeader
                   activeTab={activeTab}
                   setActiveTab={setActiveTab}
                   weekDates={weekDates}
                   setWeekDates={setWeekDates}
                   pending={true}
                   currentIndex={currentIndex}
                   setCurrentIndex={setCurrentIndex}
                   setCurrentIndexStatus={setCurrentIndexStatus}
                   pendingWeekDate={pendingWeekDate}
                   totalPending={pendingDates.length}
                 />
               </Box>
               {activeTab === 'Monthly' ? (
                 <MonthlyTimesheet />
               ) : (
                 <Box mt="8">
                   <WeekDateHeader weekDates={weekDates} totalHours={totalHours} pendingDates={pendingDates} />
                   <Box display={'flex'} flexDirection={'column'} height={'calc(100vh - 344px)'}>
                     <Box style={weekActivityList.length > 7 ? { overflowY: 'auto', height: 'auto' } : {}}>
                       <form>
                         {weekActivityList.map((data: any, index: number) => (
                           <Flex mb="2" key={index} className="hourRows">
                             <Box w="38%">
                               <Flex h="100%">
                                 <Box w="40%" h="100%">
                                   <CustomSelect
                                     placeholder="Select project"
                                     isDisabled
                                     value={data.project}
                                     options={[
                                       {
                                         label: 'Your Projects/Clients',
                                         options: PROJECTLIST,
                                       },
                                     ]}
                                     color="#1E293B"
                                   />
                                 </Box>
                                 <Box w="60%" ml="2" h="100%">
                                   {data.project.type === 'other' ? (
                                     <Input
                                       height="100%"
                                       color="#64748B"
                                       placeholder="Enter Text"
                                       borderRadius={'12px'}
                                       _focusWithin={{ border: '1px solid #64748B!important' }}
                                       _hover={{ border: '1px solid #D6D3FD' }}
                                       _focusVisible={{ boxShadow: 'none' }}
                                       _placeholder={{ color: '#94A3B8' }}
                                       _disabled={{ color: '#64748B', borderColor: '#F1F5F9' }}
                                       readOnly
                                       disabled
                                       value={data.task}
                                     />
                                   ) : (
                                     <CustomSelect
                                       placeholder="Select task"
                                       value={data.task}
                                       isDisabled
                                       options={[
                                         {
                                           label: 'Task',
                                           options: PROJECTLIST,
                                         },
                                       ]}
                                       color="#64748B"
                                     />
                                   )}
                                 </Box>
                               </Flex>
                             </Box>
                             <Box w="62%" ml="4">
                               <Grid templateColumns="repeat(8,minmax(96px, 1fr)) 28px" gap={2}>
                                 {weekDates.map(
                                   ({ date, hour, day }: { date: any; hour: any; day: any }, dayIndex: any) => (
                                     <GridItem className="gridItem" position={'relative'} colSpan={1} key={dayIndex}>
                                       {index >= 5 && !isAfter(date, getISTDate()) && data[day].remark.length > 0 ? (
                                         <Box
                                           pb="5px"
                                           top="-213px"
                                           className="inputTextArea"
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
                                               <Textarea
                                                 className="inputTextAreaField"
                                                 h="139px"
                                                 p="0"
                                                 border="none"
                                                 outline="none"
                                                 color="neutral.700"
                                                 textStyle="rgRegular"
                                                 resize="none"
                                                 _focusVisible={{ borderColor: 'transparent', boxShadow: 'none' }}
                                                 defaultValue=""
                                                 value={data[day].remark}
                                               ></Textarea>
                                             </Box>
                                           </Box>
                                         </Box>
                                       ) : null}

                                       <Input
                                         className={`inputField`}
                                         p="3"
                                         h="46px"
                                         cursor="pointer"
                                         bg="neutral.100"
                                         fontSize="14px"
                                         border="none"
                                         outline="none"
                                         value={data[day]?.hour}
                                         color={
                                           isAfter(date, getISTDate())
                                             ? 'neutral.300'
                                             : data[day]?.hour === '00:00'
                                             ? 'neutral.500'
                                             : 'neutral.700'
                                         }
                                         textStyle="rgRegular"
                                         resize="none"
                                         textAlign="center"
                                         _hover={{
                                           backgroundColor: isAfter(date, getISTDate()) ? 'neutral.100' : 'neutral.200',
                                         }}
                                         //  _focus={
                                         //    !isAfter(date, new Date())
                                         //      ? {
                                         //          backgroundColor: 'primary.100',
                                         //          border: '1px solid #5A50E0',
                                         //          color: 'neutral.700',
                                         //        }
                                         //      : {}
                                         //  }
                                         _disabled={{
                                           opacity: 1,
                                         }}
                                         maxLength={5}
                                         minLength={4}
                                         readOnly
                                         _focusVisible={{ boxShadow: 'none' }}
                                         disabled={isAfter(date, getISTDate())}
                                       ></Input>
                                       {index < 5 && !isAfter(date, getISTDate()) && data[day].remark.length > 0 ? (
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
                                               <Textarea
                                                 className="inputTextAreaField"
                                                 h="139px"
                                                 p="0"
                                                 border="none"
                                                 outline="none"
                                                 color="neutral.700"
                                                 textStyle="rgRegular"
                                                 resize="none"
                                                 _focusVisible={{ borderColor: 'transparent', boxShadow: 'none' }}
                                                 defaultValue=""
                                                 value={data[day].remark}
                                               ></Textarea>
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
                                       {data.totalHour}
                                     </Text>
                                   </Box>
                                 </GridItem>
                               </Grid>
                             </Box>
                           </Flex>
                         ))}
                       </form>
                     </Box>
                     {user.Role === 'Manager' || (user.TeamName.trim() === employ.TeamName.trim() && user.EmpName.trim() === employ.ManagerName.trim()) ? (
                       <Flex>
                         <Box w="38%"></Box>
                         <Box w="62%" ml="4" alignItems="center" my="auto">
                           <Grid templateColumns="repeat(8,minmax(96px, 1fr)) 28px" gap={2}>
                             {weekDates.map(
                               ({ date, hour, day }: { date: any; hour: any; day: any }, dayIndex: any) => (
                                 <GridItem colSpan={1} key={dayIndex}>
                                   {isAfter(getISTDate(), date) && dayStatus[dayIndex]?.TmsStatus !== '' ? (
                                     <>
                                       <Center>
                                         <Text as="span" p="6px">
                                           {dayStatus[dayIndex]?.TmsStatus === 'Approved' ? (
                                             <>
                                               <Like1
                                                 className="hoverButton cp"
                                                 size="24"
                                                 color="#159D70"
                                                 variant="Bold"
                                               />
                                               {getRemark(dayStatus[dayIndex])}
                                             </>
                                           ) : (
                                             <Like1
                                               className="cp"
                                               size="24"
                                               color={iconType[dayIndex][0].color}
                                               variant={iconType[dayIndex][0].type}
                                               onMouseOver={() =>
                                                 updateIcon(dayIndex, 0, { type: 'Bold', color: '#159D70' })
                                               }
                                               onMouseLeave={() =>
                                                 updateIcon(dayIndex, 0, { type: 'Linear', color: '#8ED7C0' })
                                               }
                                               onClick={() => {
                                                 if (dayStatus[dayIndex]?.TmsStatus !== 'Rejected') {
                                                   openModal({
                                                     status: 'approve',
                                                     TmsId: dayStatus[dayIndex]?.TmsId,
                                                     date,
                                                   });
                                                 }
                                               }}
                                             />
                                           )}
                                         </Text>
                                         <Text as="span" p="6px">
                                           {dayStatus[dayIndex]?.TmsStatus === 'Rejected' ? (
                                             <>
                                               <Dislike
                                                 className="hoverButton cp"
                                                 size="24"
                                                 color="#E54848"
                                                 variant="Bold"
                                               />
                                               {getRemark(dayStatus[dayIndex])}
                                             </>
                                           ) : (
                                             <Dislike
                                               className="cp"
                                               size="24"
                                               color={iconType[dayIndex][1].color}
                                               variant={iconType[dayIndex][1].type}
                                               onMouseOver={() =>
                                                 updateIcon(dayIndex, 1, { type: 'Bold', color: '#E54848' })
                                               }
                                               onMouseLeave={() =>
                                                 updateIcon(dayIndex, 1, { type: 'Linear', color: '#F5BDBD' })
                                               }
                                               onClick={() => {
                                                 if (dayStatus[dayIndex]?.TmsStatus !== 'Approved') {
                                                   openModal({
                                                     status: 'reject',
                                                     TmsId: dayStatus[dayIndex]?.TmsId,
                                                     date,
                                                   });
                                                 }
                                               }}
                                             />
                                           )}
                                         </Text>
                                       </Center>
                                       {dayStatus[dayIndex]?.ResubmitStatus ? (
                                         <Center as="span" p="6px">
                                           <Text as="span" textStyle="smMedium" color="warning.300">
                                             Resubmitted
                                           </Text>
                                         </Center>
                                       ) : null}
                                     </>
                                   ) : (
                                     <Box p="3"></Box>
                                   )}
                                 </GridItem>
                               ),
                             )}
                             <GridItem colSpan={1}>
                               <Box p="3"></Box>
                             </GridItem>
                             <GridItem colSpan={1}></GridItem>
                           </Grid>
                         </Box>
                       </Flex>
                     ) : null}
                   </Box>
                 </Box>
               )}
             </Box>
           </Box>
           <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={() => closeModal()} size="lg">
             <ModalOverlay />
             <ModalContent>
               <ModalHeader px="4" py="14px">
                 <Flex>
                   <Box my="auto">
                     <Text className="resubmit-modal-heading">Add remark</Text>
                   </Box>
                   <Spacer />
                   <Box>
                     <CloseSquare size="24" className="cp" onClick={() => closeModal()} color="#CBD5E1" />
                   </Box>
                 </Flex>
               </ModalHeader>
               <ModalBody p="0">
                 <ApproveReject close={() => closeModal()} submit={(data: any) => submitModal(data)} data={modalData} />
               </ModalBody>
             </ModalContent>
           </Modal>
         </>
       ) : null}
     </ScaleFade>
   );
}

export default UserTimesheet;