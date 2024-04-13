import { Box, Button,Checkbox,Text, Textarea } from '@chakra-ui/react';
import { useState } from 'react';

const ApproveReject = (props: any) => {
  const {status,TmsId,EmpId } = props.data;
  const [remark,setRemark] = useState<any>('');
  const [checkbox,setCheckbox] =useState<any>(false);
  const currentStatus = status === 'approve' ? 'Approved' : 'Rejected';
  const [errorStatus,setErrorStatus] = useState<Boolean[]>([false,false]);

  const submit = () => {
    let bool=[false,false]
    if(!checkbox){
      bool[1]=true;
    }
    if(status !== 'approve' && remark.length === 0){
      bool[0] = true; 
    }
    if(bool.every((data) => data === false)){
      props.submit({EmpId,TmsId,TmsStatus : currentStatus,StatusRemark:remark});
      return ;
    }
   setErrorStatus(bool);
  }



  return (
    <Box>
      <Box my="4" mx="5">
        <Box >
          <Box>
            <Text as="h6" textStyle={'rgRegular'} color="neutral.700">
              Remark
            </Text>
          </Box>
         <Box className={status === 'reject' && errorStatus[0] && remark.length === 0 ? 'error-modal error-text' : ''}>
          <Box>
            <Textarea
              minH={'81px'}
              p="3"
              _focusVisible={{ borderColor: 'transparent', boxShadow: 'none' }}
              my="1"
              placeholder="Type here"
              bg="neutral.100"
              borderRadius="base"
              border="none"
              _placeholder={{ color: '#94A3B8' }}
              onFocus={() => setErrorStatus([false,errorStatus[1]])}
              onChange={(e) => setRemark(e.target.value)}
            ></Textarea>
          </Box>
          <Box mb="6">
            <Text as="span" textStyle="rgRegular" color="neutral.500">
              Add reason to {status} the timesheet
            </Text>
          </Box>
          </Box>
          <Box >
            <Checkbox  onChange={(e) => {setErrorStatus([errorStatus[0],false]); setCheckbox(e.target.checked);}} colorScheme="primary" size='lg' className={errorStatus[1] && !checkbox ? 'error-modal' :''}>
                <Text as='span' color='#1E293B'>
                I am sure to <Text as='span' color={status === 'approve' ? '#159D70' :'#E54848'}>{status}</Text> this timesheet.
                </Text>
            </Checkbox>
          </Box>
        </Box>
        <Box mx="1">
          <Box className="modal-buttons-container-outer">
            <Box className="modal-buttons-container">
              <Button className="modal-discard-button" onClick={props.close}>
                <Box className="modal-discard-button-text">Discard</Box>
              </Button>
              <Button className="modal-resubmit-button" onClick={() => submit()}>
                <Box className="modal-resubmit-button-text">Submit</Box>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ApproveReject;
