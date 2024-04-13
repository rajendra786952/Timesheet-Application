import { Flex, Box, Spacer, Image, Heading, Avatar, Text, Icon, Center, Tooltip, Button, MenuButton, MenuItem, MenuList, Menu,  MenuDivider, Tag } from '@chakra-ui/react';
import { Timer, Setting2, Notification, LogoutCurve, Logout, Setting} from 'iconsax-react';
import { useNavigate } from 'react-router-dom';
import user from '@/assets/Avatar.jpeg'
import { useAppDispatch, useAppSelector } from '@/app/store';
import { logOutUser } from '@/app/features/user/userSlice';
import axiosJSON from '@/utils/api';
import { resetEmploy } from '@/app/features/employ/employSlice';
import { resetFilter } from '@/app/features/filter/filterSlice';
import React from 'react';


const TITLE =[{name:"TIME",color:'primary.300'},{name:"SHEET",color:'neutral.700'}]
const TAB = ['My Timesheets', 'All Timesheets'];

const Header = (props:any) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector<any>((state) => state.user);

  const CustomMenuButton = React.forwardRef((props:any, ref:any) => {
    // Destructure the children and onClick from props
    const { children, onClick } = props;
    return (
      <Button ref={ref} variant="link" onClick={onClick} display="flex" alignItems="center">
        {children}
      </Button>
    );
  });
  
  const setting = () => {
   if(user.Role === 'Team Lead' || user.Role === 'Manager'){
      navigate('/manager/setting')
   }
   if(user.Role === 'Employee'){
    navigate('/timesheet/setting')
   }
  }
  
  const logout = () => {
    delete axiosJSON.defaults.headers['token'];
    dispatch(logOutUser());
    dispatch(resetEmploy());
    dispatch(resetFilter());
  }
  return (
    <Flex>
      <Box display="flex" alignItems="center">
        <Flex>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Timer size="26" color="#5A50E0" variant="Bulk" />
          </Box>
          <Box ml="4.57">
            {TITLE.map(({ name, color }, index) => (
              <Heading key={index} as="h6" fontSize="22.857px" color={color} lineHeight="36px" display="inline">
                {name}
              </Heading>
            ))}
          </Box>
        </Flex>
        {props.hasOwnProperty('tab') && props.tab ? (
          <Flex ml="6" bg="neutral.100" borderRadius="xl" border="1px solid #F1F5F9" p="1">
            {TAB.map((data, index) => (
              <Box
                key={index}
                ml={index === 1 ? 1 : 0}
                bg={props?.activeTab === data ? 'primary.300' : 'neutral.100'}
                px="28px"
                py="10px"
                display="flex"
                borderRadius="btn"
                cursor="pointer"
                onClick={() => {
                  data === 'All Timesheets' ? navigate('/manager') : navigate('/manager/my');
                  props.setActiveTab(data);
                }}
              >
                <Text
                  as="span"
                  ml="6px"
                  color={props?.activeTab === data ? 'white' : 'neutral.500'}
                  textStyle="rgRegular"
                >
                  {data}
                </Text>
              </Box>
            ))}
          </Flex>
        ) : null}
      </Box>
      <Spacer />
      <Box>
        <Flex>
          {/* <Box p="3">
            <Setting2 size="20" color="#64748B" />
          </Box>
          <Box p="3">
            <Notification size="20" color="#64748B" />
          </Box> 
             13.2px
          <Avatar height={'35px'} width={'35px'} src={user} borderRadius="50%" /> 
          */}
          <Box display={'flex'}>
            <Box display={'flex'} alignItems={'center'} ml={'2'}>
              <Box textAlign={'right'}>
                <Box>
                {/* color="neutral.700" */}
                <Text as="h6" mt='5px' color="neutral.700" fontSize={'1rem'} lineHeight={'0.5'} >
                  {user.EmpName}
                </Text>
                </Box>
                <Box>
                {/* color="neutral.500" */}
                <Text as="span"  color="neutral.500" fontSize={'.9rem'}>
                  {user.Designation}
                </Text>
                </Box>
              </Box>
            </Box>
            <Box className="cp" ml="2">
              <Menu>
                <MenuButton as={CustomMenuButton}>
                <Avatar height={'35px'} width={'35px'} src={user} borderRadius="50%" /> 
                </MenuButton>
                <MenuList py='1'>
                  {/* <MenuItem onClick={() => setting()}>
                  <Box display={'flex'} px='3'>
                      <Box pr='3' display={'flex'} alignItems={'center'}>
                      <Setting2 size="20" color="#64748B" />
                      </Box>
                      <Box>
                      Setting
                      </Box>
                    </Box>
                  </MenuItem>
                  <MenuDivider my='0' /> */}
                  <MenuItem onClick={() => logout()}>
                    <Box display={'flex'} px='3'>
                      <Box pr='3' display={'flex'} alignItems={'center'}>
                      <Icon w="18px" h="18px" cursor="pointer" as={LogoutCurve} color="#64748B" />
                      </Box>
                      <Box>
                      Logout
                      </Box>
                    </Box>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Box>
          {/* <Box>
            <Tooltip hasArrow label="click to logout">
              <Box
                h="100%"
                onClick={() => logout()}
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{ color: 'error.300', backgroundColor: 'error.100', borderRadius: '10px' }}
                px="3"
                className="logout-icon cp"
              >
                <Icon w="18px" h="18px" cursor="pointer" as={LogoutCurve} color="#64748B" />

                <LogoutCurve className="logout-bold-icon" size="18" variant="Bold" color="#DC2626" />
              </Box>
            </Tooltip>
          </Box>
          <Box ml="2">
            <Avatar src={user} borderRadius="13.2px" />
          </Box> */}
        </Flex>
      </Box>
    </Flex>
  );
};



export default Header;

