import { getCurrentStatus } from "@/utils/date";
import { Box, Center, Flex, Grid, GridItem,Text } from "@chakra-ui/react";
import { format } from "date-fns";

export const weekDateHeaderUI = (dateStatus: any,index:any,name:string) => {
  
    let weekDate = dateStatus;
    return (
      <GridItem className={name} key={index} colSpan={1} px="2" pb="1" pt="6px" bg={weekDate.bg} borderRadius="lg">
        <Box>
          <Center>
            <Text as="span" className={`${name}heading`} color={weekDate.dateColor} textStyle="smMedium" display="block">
              {weekDate.dateString}
            </Text>
          </Center>
        </Box>
        <Box mt="2px">
          <Center>
            <Text as="span" color={weekDate.hourColor} textStyle="rgMedium" display="block">
              {weekDate.hour}
            </Text>
          </Center>
        </Box>
      </GridItem>
    );
  };

const WeekDateHeader = (props:any) => {
  
    const {weekDates , totalHours} = props;

    const getClassName = (date:any) => {
      if(props.hasOwnProperty('pendingDates') &&  props.pendingDates.length > 0 ){
       return props.pendingDates.indexOf(format(date,'yyyy-MM-dd')) !== -1 ? 'activePendingDate' :'';
      }
      return '';
    }

    return (
        <Flex mb="4">
            <Box w="38%" pb="6px">
              <Flex h="100%">
                <Box w="40%" px="2" display="flex" flexDirection="column-reverse">
                  <Text as="span" color="neutral.600" textStyle="rg1SemiBold">
                    PROJECT/CLIENT
                  </Text>
                </Box>
                <Box w="60%" ml="4" px="2" display="flex" flexDirection="column-reverse">
                  <Text as="span" color="neutral.600" textStyle="rg1SemiBold">
                    TASK
                  </Text>
                </Box>
              </Flex>
            </Box>
            <Box w="62%" ml="4">
              <Grid templateColumns="repeat(8,minmax(96px, 1fr)) 28px" gap={2}>
                {weekDates.map(({ date, hour }:{date:any,hour:any},index:any) => {
                  const dateStatus:any = getCurrentStatus(date, hour,props.pendingDates);
                  return weekDateHeaderUI(dateStatus,index,getClassName(date))
                })}
                <GridItem colSpan={1}>
                {
                weekDateHeaderUI({
                    dateString: 'Week Total',
                    hour: totalHours,
                    bg: 'transparent',
                    dateColor: 'neutral.600',
                    hourColor: 'primary.300',
                  },8,'')
                }
                </GridItem>
                <GridItem colSpan={1}>
                  <Box w="28px"></Box>
                </GridItem>
              </Grid>
            </Box>
          </Flex>
    )
}

export default WeekDateHeader;