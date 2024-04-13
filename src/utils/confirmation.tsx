import { Box,Button,Text } from "@chakra-ui/react";
import { ClipboardText } from "iconsax-react";

const ConfirmationPopup = (props:any) => {
const {date,close,success } = props;
 return (
     <Box px='6' pt='6' pb='4'>
         <Box textAlign={'center'} mb='4'>
         <Text as='span' p='3' bg='#F1F0FF' borderRadius='full' display={'inline-flex'}>
          <ClipboardText size="24" color="#5A50E0" variant="Bold"/>
          </Text>
         </Box>
         <Box textAlign='center'>
          <Text as='h6' color='#101828' textStyle='lgSemiBold' mb='1'>
           Submit the timesheet?
          </Text>
          <Text as='span' color='gray.500' textStyle='mdRegular'>
          Are you sure to submit the timesheet for {date}? This action can not be undone.
          </Text>
         </Box>
         <Box display={'flex'} justifyContent='center' mt='10'>
            <Button 
            onClick={() => close()} 
            w='144px' mr='3'_hover={{bg:'white'}} color='neutral.600'  bg='white' border='1px solid #E2E8F0' px='5' py='3'>Cancel</Button> 
            <Button onClick={() => success()} w='144px' px='5' py='3' >Yes Submit</Button> 
         </Box>
     </Box>
 )
}

export default ConfirmationPopup;