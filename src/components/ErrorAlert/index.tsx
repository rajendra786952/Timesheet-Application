import { Alert, AlertIcon, Box } from "@chakra-ui/react";

const ErrorAlert = ({message}:any) => {
  return (
    <Box display='flex'
    justifyContent='center'>
    <Alert status='error' variant='left-accent' 
    color='#BE1F1F'
    bg="#FEF2F2"
    width='auto'
    position='absolute'
    top='32px'
    borderRadius='12px'
    border='1px'
    borderColor='#F5BDBD'
    fontFamily='figtree'
    fontWeight='600'
    >
    <AlertIcon color='#E54848' />
    {message}
   </Alert>
   </Box>
  )
}

export default ErrorAlert;