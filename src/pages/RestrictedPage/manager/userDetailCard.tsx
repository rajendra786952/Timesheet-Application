import { Avatar, Box, Flex,Text,Button, Spacer  } from "@chakra-ui/react";
import { User } from "iconsax-react";
import userImage from '@/assets/Avatar.png';

const user = {name:'Prashant Kumar',position:'Software engineer L2',department:'Enigneering',team:'Product'}
const UserDetail = (props:any) => {
  const {employ:{ EmpName,DepartmentName,TeamName,Designation } } = props;
  return (
    <Box className="user-detail-card">
      <Flex>
        <Box>
          {/* <Avatar  name='user profile' w="52px" h="52px" src={userImage}/> */}
          <Box borderRadius="50%" p="3" bg="#F1F0FF">
            <User size="28" color="#5A50E0" variant="Bulk" />
          </Box>
        </Box>
        <Box ml="3">
          <Text as="h6" color="neutral.700" textStyle="lgSemiBold">
            { EmpName }
          </Text>
          <Text as="span" color="neutral.600" textStyle="rgRegular">
            {Designation}
          </Text>
        </Box>
        <Spacer />
        <Box ml='72px'>
          <Button borderRadius="6px" px="2" py="1" variant="solid" bg="#F1F5F9" _hover={{ backgroundColor: '#F1F5F9' }}>
            <Text as="span" color="neutral.600">
              {DepartmentName}
            </Text>
          </Button>
          <Button
            ml="1"
            borderRadius="6px"
            px="2"
            py="1"
            variant="solid"
            bg="#F1F0FF"
            _hover={{ backgroundColor: '#F1F0FF' }}
          >
            <Text as="span" color="primary.300">
              {TeamName}
            </Text>
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}

export default UserDetail;