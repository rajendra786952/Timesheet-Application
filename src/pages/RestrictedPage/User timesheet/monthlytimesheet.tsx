import { Box, Flex, Heading, Text, Image } from "@chakra-ui/react";
import monthly from '@/assets/monthly.png'
const MonthlyTimesheet = () => {
const getStyle =(fontSize:any,fontWeight:any,lineHeight='normal') => {
    return {
        fontSize,
        fontWeight,
        lineHeight,
        fontFamily:'Figtree'
    }
}
 return (
    <Flex
    align="center"
    justify="center"
    my='80px'
  >
    <Box textAlign="center">
      <Image src={monthly} alt="Image Alt Text" mx='auto'  /> {/* Adjust image properties */}
      <Heading mt={6} color='primary.300' style={getStyle('40px',700)}>
      Monthly view coming soon!
      </Heading>
      <Text mt={2} color='neutral.500' style={getStyle('18px',500,'26px')} >
      stay tuned for the monthly view in the upcoming version.
      </Text>
    </Box>
  </Flex>
 )
}

export default MonthlyTimesheet;