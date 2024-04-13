import { Box, Button, Flex , Spacer, Text } from "@chakra-ui/react";
import { ArrowLeft2, ArrowRight, ArrowRight2, Calendar, RowHorizontal } from "iconsax-react";
import { getWeekDate,checkCurrentWeek } from'@/utils/date';
import { add, format, isAfter, isBefore, sub } from "date-fns";
import { useState } from "react";
import { getISTDate } from "@/utils/timesheet";


const TAB = [
    { icon: (color: string) => <Calendar size="18" color={color} />, name: 'Monthly' },
    { icon: (color: string) => <RowHorizontal size="18" color={color} />, name: 'Weekly' },
  ];
  
const DateHeader = (props:any) => {
  const {weekDates,setWeekDates,activeTab,setActiveTab} = props;
  const [currentChange,setCurrentChange]  = useState(false);
  const left = (callback:any) => {
    return (
      <Box>
        <ArrowLeft2
          size="16"
          cursor="pointer"
          color="#CBD5E1"
          variant="Bold"
          onClick={() => callback()}
        />
      </Box>
    );
  };

  const right = (callback:any) => {
   return (
    <ArrowRight2
    size="16"
    cursor="pointer"
    color="#CBD5E1"
    variant="Bold"
    onClick={() => callback()}
  />
   )
  }
  
 const getToday = () => {
  if(!checkCurrentWeek(weekDates[0].date,weekDates[6].date)){
    if(props.hasOwnProperty('pendingWeekDate')){
      props.setCurrentIndex(props.pendingWeekDate.length -1);
    }
    setWeekDates(getWeekDate(getISTDate()));
  }
 }

 const updateCurrentChange = (value:any) => {
  setCurrentChange(value)
 }

 const setSameCurrentIndex = () => {
  setWeekDates(getWeekDate(getISTDate(props.pendingWeekDate[props.currentIndex])));
  updateCurrentChange(false);
 }
  
  return (
    <Flex>
      <Box display={'flex'} alignItems={'center'}>
        <Box>
        <Button
          size="md"
          borderRadius="8px"
          lineHeight="20px"
          borderColor="neutral.300"
          colorScheme="neutral"
          variant="outline"
          onClick={ () =>  getToday()}
        >
          Today
        </Button>
      </Box>
      <Box ml={"4"} display="flex" h="38px" alignItems="center">
        <Box>{left(() => {
          let date = sub(weekDates[0].date, { days: 7 });
         if(props.hasOwnProperty('pendingWeekDate') && props.pendingWeekDate.includes(format(weekDates[0].date,'yyyy-MM-dd')) &&props.pendingWeekDate.includes(format(date,'yyyy-MM-dd'))){
           props.setCurrentIndex(props.currentIndex-1);
         }
         if(props.hasOwnProperty('pendingWeekDate') && !currentChange && isBefore(date,sub(getISTDate(props.pendingWeekDate[0]),{days:1}))){
           updateCurrentChange(true)
         }
          setWeekDates(getWeekDate(date))
        })}</Box>
        <Box display="flex" mx="2">
          <Box>
            <Text as="span" color="primary.300" textStyle="mdSemiBold">
              {format(weekDates[0].date, 'dd')}{' '}
            </Text>
            <Text as="span" color="neutral.700" textStyle="mdSemiBold">{`${format(weekDates[0].date, 'MMM')} '${format(
              weekDates[0].date,
              'yy',
            )}`}</Text>
          </Box>
          <Box display="flex" alignItems="center" mx="2">
            <ArrowRight size="14" color="#64748B" variant="Broken" />
          </Box>
          <Box>
            <Text as="span" color="primary.300" textStyle="mdSemiBold">
              {format(weekDates[6].date, 'dd')}{' '}
            </Text>
            <Text as="span" color="neutral.700" textStyle="mdSemiBold">{`${format(weekDates[6].date, 'MMM')} '${format(
              weekDates[6].date,
              'yy',
            )}`}</Text>
          </Box>
        </Box>
        <Box>{right(() =>{
            let date = add(weekDates[0].date, { days: 7 });
            if(props.hasOwnProperty('pendingWeekDate') && props.pendingWeekDate.includes(format(weekDates[0].date,'yyyy-MM-dd')) && props.pendingWeekDate.includes(format(date,'yyyy-MM-dd'))){
              props.setCurrentIndex(props.currentIndex+1);
            }
            if(props.hasOwnProperty('pendingWeekDate') && !currentChange && isAfter(date,add(getISTDate(props.pendingWeekDate[props.pendingWeekDate.length-1]),{ days: 1 }))){
              updateCurrentChange(true)
            }
            setWeekDates(getWeekDate(date))
        }
        )}</Box>
      </Box>
      </Box>
      <Spacer />
      {props.hasOwnProperty('pending') && props.pending && props.totalPending > 0? (
        <Box mr="4" display='flex' alignItems='center'>
            <Box style={ {visibility: props.currentIndex > 0 ? 'visible' : 'hidden' }} >{left(() => {
               if(currentChange && isBefore(add(getISTDate(props.pendingWeekDate[props.pendingWeekDate.length -1]),{days:1}),weekDates[0].date)){
                setSameCurrentIndex()
                return;
                } 
               if(props.currentIndex > 0){ props.setCurrentIndexStatus(false);props.setCurrentIndex(props.currentIndex-1)}})}</Box>
            <Box mx="2">
                <Text as="h6" textStyle='mdSemiBold' color='warning.300'>
                    {`Pending - ${props.totalPending}`}
                </Text>
            </Box>     
            <Box style={ {visibility: props.currentIndex < props.pendingWeekDate.length - 1  ? 'visible' : 'hidden' }} >{right(() => {
              if(currentChange &&  isAfter(sub(getISTDate(props.pendingWeekDate[0]),{ days: 1 }),weekDates[0].date)){
                setSameCurrentIndex()
                return;
              } 
              if(props.currentIndex < props.pendingWeekDate.length -1 ){props.setCurrentIndexStatus(false);props.setCurrentIndex(props.currentIndex+1)}})}</Box>
        </Box>
      ) : null}

      <Box bg="neutral.100" borderRadius="xl" border="1px solid #F1F5F9" p="1">
        <Flex>
          {TAB.map(({ name, icon }, index) => (
            <Box
              key={index}
              ml={index === 1 ? 1 : 0}
              bg={activeTab === name ? 'primary.300' : 'neutral.100'}
              px="28px"
              py="10px"
              display="flex"
              cursor="pointer"
              borderRadius="btn"
              onClick={() => setActiveTab(name)}
            >
              <Text as="span">{icon(activeTab === name ? 'white' : '#94A3B8')}</Text>
              <Text as="span" ml="6px" color={activeTab === name ? 'white' : 'neutral.500'} textStyle="rgRegular">
                {name}
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>
    </Flex>
  );
}

export default DateHeader;