import { Box, Button, Checkbox, Flex, Input, InputGroup, InputLeftElement, InputRightElement, ScaleFade, Spacer, Spinner, Text, VStack } from '@chakra-ui/react';
import { ArrowDown2,  ClipboardTick, SearchStatus, Timer1, UserSearch } from 'iconsax-react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
  } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { useAppToast } from '@/utils/toastUtil';
import { getSearchEmploy } from '@/utils/timehseetApi';
import { setLoader } from '@/app/features/loader/loaderSlice';
import { setEmploy} from '@/app/features/employ/employSlice';
import useDebounce from '@/app/hooks/useDebounce';
import { setFilter } from '@/app/features/filter/filterSlice';
import { setToken } from '@/utils/api';


const Team = [
    'Product',
    'Awesome',
    'Ace',
    'Epimonis',
    // 'Induci',
    'Code',
    // 'Boto3',
    'Training',
    'ODC'
  ];
const Department =[
'Engineering Product',
'Engineering Kaizen',
// 'Marketing',
// 'Relation',
'Training',
'ODC'
]

const ManagerTimesheetView: React.FC = () => {
  const { filter } = useAppSelector<any>((state) =>  state.filter );
  const { user } = useAppSelector<any>((state) => state.user);
  const { successToast, errorToast } = useAppToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [employList,setEmployList] = useState<any>([]);
  const [teamList,setTeamList] = useState(Team)
  const [departmentList,setDepartmentList] = useState(Department);
  const [spinner,setSpinner] = useState<any>(true);
  const [selectedTeam,setSelectedTeam] = useState<String[]>([]);
  const [selectedDepartment,setSelectedDepartment] = useState<any>([])
  const inputRef = useRef<any>(null);
  const departmentRef = useRef<any>(null);
  const [query, setQuery] = useState<string>('')
  const debouncedValue = useDebounce<string>(query, 700)
  const [scrollKey,setScrollKey] = useState({exclusive_start_key:'None'})
  const [hasMore, setHasMore] = useState(false);
  const [infinteStatus,setInfiniteStatus] = useState<any>(false);
  const containerRef = useRef<any>(null);
  const [searchStatus,setSearchStatus] = useState<any>(false);
  const getStatus = useCallback((pending: any) => {
    const { color, bg, text, icon } =
      pending > 0
        ? {
            color: '#EDA302',
            bg: '#FFFAE5',
            text: `Approval pending - ${pending}`,
            icon: <Timer1 size="14" color="#EDA302" />,
          }
        : { color: '#64748B', bg: '#F1F5F9', text: 'Up to date', icon: <ClipboardTick size="14" color="#64748B" /> };
    return (
      <Button borderRadius="6px" px="2" py="1" variant="solid" bg={bg} _hover={{ backgroundColor: bg }}>
        <Text as="span">{icon}</Text>
        <Text as="span" ml="1" color={color}>
          {text}
        </Text>
      </Button>
    );
  },[]);
  
  useEffect(() => {
    setToken();
   },[])

  useEffect(() => {
    let params:any=filter;
    setQuery(filter['emp_name']);
    setSelectedDepartment(filter['department_name']);
    setSelectedTeam(filter['team_name']);
    dispatch(setEmploy({}));
    dispatch(setLoader(true));
    getSearch(params)
  },[])
  
  const filterTeam = (team:any) => {
   setTeamList(Team.filter((data) => data.toLowerCase().startsWith(team.toLowerCase())));
  }

  const filterDepartment = (department:any) => {
    setDepartmentList(Department.filter((data) => data.toLowerCase().startsWith(department.toLowerCase())));
   }
  
  const getSearch = async (param:any,type='filter') => {
    try{
      let req:any = {};
      for(let i in param){
        if( user.hasOwnProperty('Role') && user.Role === 'Manager' && param[i] instanceof Array && param[i].length > 0){
         req[i] = param[i].toString();
        }
        else if(typeof param[i] === 'string' && param[i].trim().length > 0){
         req[i]=param[i];
        }
      }
      const response = await getSearchEmploy(req);
      if(response.data?.status_code === 200){
         setScrollKey({exclusive_start_key:response.data.response.exclusive_start_key.toString()});
         let list = [];
         if(type === 'filter'){
          list = response.data.response.result;
         }
         else{
          list = [...employList,...response.data.response.result];
         }
         setEmployList(list);
       }
       else if(response.data?.status_code !== 200){
         setEmployList([]);
        errorToast('Error', response.data?.message)
       }
       setInfiniteStatus(false);
       setSpinner(false);
       dispatch(setLoader(false));
     }
     catch(error:any){
      dispatch(setLoader(false));
      setSpinner(false);
      errorToast('Error', error?.message?.toString());
     }
  }



  const goToTimesheet = (data:any) => {
    // if(data.PendingCount > 0 ){
      dispatch(setEmploy(data));
      navigate(`/manager/${data.EmpId}`);
   // }
  }

const search = useCallback((data:any) => {
  if(!searchStatus){
    setSearchStatus(true);
  }
  setQuery(data);
},[])


useEffect(() => {
  
  if(!spinner && searchStatus){
    dispatch(setFilter({...filter,emp_name:debouncedValue.trim(),exclusive_start_key:'None'}))
    dispatch(setLoader(true));
    getSearch({exclusive_start_key:'None',emp_name:debouncedValue.trim(),team_name:selectedTeam,department_name:selectedDepartment});
  }
}, [debouncedValue])

const handleScroll = () => {
  const container = containerRef.current;
  if (container) {
    const isScrolledToBottom =
      container.scrollHeight - container.scrollTop === container.clientHeight;
    if (isScrolledToBottom && hasMore && !infinteStatus) {
       setInfiniteStatus(true);
       getScrollData()
    }
  }
};

useEffect(() => {
  const container = containerRef.current;

  if (container) {
    container.addEventListener('scroll', handleScroll);
  }

  return () => {
    if (container) {
      container.removeEventListener('scroll', handleScroll);
    }
  };
}, [handleScroll]);



useEffect(() => {
 if(scrollKey.exclusive_start_key === 'None'){
   setHasMore(false);
 }
 else{
   setHasMore(true);
 }
},[scrollKey])

const getScrollData = () => {
  dispatch(setFilter({...filter,exclusive_start_key:scrollKey}))
  getSearch({...scrollKey,emp_name:debouncedValue.trim(),team_name:selectedTeam,department_name:selectedDepartment},'scroll');
}

  return (
    <ScaleFade in initialScale={0.6}>
      {!spinner ? (
        <Box px="4">
          <Box>
            <Flex>
              <Box>
                <InputGroup>
                  <InputLeftElement
                    pr="2"
                    pl="3"
                    py="3"
                    pointerEvents="none"
                    children={<UserSearch size="20" color="#94A3B8" />}
                  />
                  <Input
                    type="text"
                    minW="352px"
                    placeholder="Search members"
                    pr="3"
                    py="3"
                    bg="neutral.100"
                    border="none"
                    outline="none"
                    borderRadius="12px"
                    color="neutral.500"
                    textStyle="rgRegular"
                    fontSize="14px"
                    h="44px"
                    value={query}
                    _focus={{ boxShadow: 'none' }}
                    onChange={(e) => search(e.target.value)}
                  />
                </InputGroup>
              </Box>
              <Spacer />
              {
                user.hasOwnProperty('Role') && user.Role === 'Manager' ?
                 (
                  <Box display={'flex'}>
                  <Box>
                    <Box className="departmentSearch">
                      <InputGroup>
                        <InputLeftElement
                          pr="2"
                          pl="3"
                          py="3"
                          h="44px"
                          pointerEvents="none"
                          children={<SearchStatus size="20" color="#94A3B8" />}
                        />
                        <Input
                          type="text"
                          placeholder="Department"
                          pr="44px"
                          w="184px"
                          py="3"
                          bg="neutral.100"
                          border="none"
                          outline="none"
                          borderRadius="12px"
                          color="neutral.500"
                          textStyle="rgRegular"
                          fontSize="14px"
                          h="44px"
                          ref={departmentRef}
                          onChange={(e: any) => filterDepartment(e.target.value)}
                          _focus={{ boxShadow: 'none' }}
                        />
                        <InputRightElement
                          className="cp"
                          w="28px"
                          h="44px"
                          pr="3"
                          py="3"
                          children={<ArrowDown2 size="16" color="#94A3B8" />}
                        />
                      </InputGroup>
                    </Box>
                    <Box className="departmentList">
                      <VStack
                        mt="1"
                        spacing={2}
                        align="start"
                        position={'absolute'}
                        px="3"
                        py="2"
                        zIndex="10"
                        minW="184px"
                        maxH="220px"
                        overflowY="auto"
                        borderRadius="12px"
                        border="1px solid  #F1F5F9"
                        background="#FFF"
                        box-shadow="0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08"
                      >
                        {departmentList.length > 0 ? (
                          departmentList.map((item, index) => (
                            <Checkbox
                              size={'md'}
                              key={index}
                              colorScheme="primary"
                              isChecked={selectedDepartment.includes(item as never) ? true : false}
                              onChange={(e) => {
                                departmentRef?.current?.focus();
                                let req={exclusive_start_key:'None',emp_name:debouncedValue.trim(),team_name:selectedTeam}
                                if (e.target.checked) {
                                  dispatch(setFilter({...filter,department_name:[...selectedDepartment,item],exclusive_start_key:'None'}))
                                  dispatch(setLoader(true));
                                  getSearch({...req,department_name:[...selectedDepartment,item]});
                                  setSelectedDepartment([...selectedDepartment, item]);
                                } else {
                                  let temp = [...selectedDepartment];
                                  temp.splice(selectedDepartment.indexOf(item), 1);
                                  dispatch(setFilter({...filter,department_name:temp,exclusive_start_key:'None'}))
                                  dispatch(setLoader(true));
                                  getSearch({...req,department_name:temp})
                                  setSelectedDepartment(temp);
                                }
                              }}
                            >
                              <Text as="span" ml="1" color="neutral.500" textStyle="rgMedium">
                                {item}
                              </Text>
                            </Checkbox>
                          ))
                        ) : (
                          <Text as="span" color="neutral.500" textStyle="rgMedium">
                            No Department Available
                          </Text>
                        )}
                      </VStack>
                    </Box>
                  </Box>
                  <Box ml="2">
                    <Box className="teamSearch">
                      <InputGroup>
                        <InputLeftElement
                          pr="2"
                          pl="3"
                          py="3"
                          h="44px"
                          pointerEvents="none"
                          children={<SearchStatus size="20" color="#94A3B8" />}
                        />
                        <Input
                          type="text"
                          placeholder="Team"
                          pr="44px"
                          w="184px"
                          py="3"
                          bg="neutral.100"
                          border="none"
                          outline="none"
                          borderRadius="12px"
                          color="neutral.500"
                          textStyle="rgRegular"
                          fontSize="14px"
                          h="44px"
                          _focus={{ boxShadow: 'none' }}
                          onChange={(e: any) => filterTeam(e.target.value)}
                          ref={inputRef}
                        />
                        <InputRightElement
                          className="cp"
                          w="28px"
                          h="44px"
                          pr="3"
                          py="3"
                          children={<ArrowDown2 size="16" color="#94A3B8" />}
                        />
                      </InputGroup>
                    </Box>
                    <Box className="teamlist">
                      <VStack
                        mt="1"
                        spacing={2}
                        align="start"
                        position={'absolute'}
                        px="3"
                        py="2"
                        zIndex="10"
                        minW="184px"
                        maxH="220px"
                        overflowY="auto"
                        borderRadius="12px"
                        border="1px solid  #F1F5F9"
                        background="#FFF"
                        box-shadow="0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08"
                      >
                        {teamList.length > 0 ? (
                          teamList.map((item, index) => (
                            <Checkbox
                              size={'md'}
                              key={index}
                              colorScheme="primary"
                              isChecked={selectedTeam.includes(item as never) ? true : false}
                              onChange={(e) => {
                                inputRef?.current?.focus();
                                const req= {exclusive_start_key:'None',emp_name:debouncedValue.trim(),department_name:selectedDepartment}
                                if (e.target.checked) {
                                  setSelectedTeam([...selectedTeam, item]);
                                  dispatch(setFilter({...filter,team_name:[...selectedTeam,item],exclusive_start_key:'None'}))
                                  dispatch(setLoader(true));
                                  getSearch({...req,team_name:[...selectedTeam,item]})
                                } else {
                                  let temp = [...selectedTeam];
                                  temp.splice(selectedTeam.indexOf(item), 1);
                                  dispatch(setFilter({...filter,team_name:temp,exclusive_start_key:'None'}))
                                  dispatch(setLoader(true));
                                  getSearch({...req,team_name:temp})
                                  setSelectedTeam(temp);
                                }
                              }}
                            >
                              <Text as="span" ml="1" color="neutral.500" textStyle="rgMedium">
                                {item}
                              </Text>
                            </Checkbox>
                          ))
                        ) : (
                          <Text as="span" color="neutral.500" textStyle="rgMedium">
                            No Team Available
                          </Text>
                        )}
                      </VStack>
                    </Box>
                  </Box>
                  </Box>
                 )
                 :
                 null
              }
            </Flex>
          </Box>
          <Box pb="4" mt="4">
            <Box>
              {/* maxH="calc(100vh - 136px)"  overflowY="auto" */}
              <TableContainer pb="4" h="calc(100vh - 136px)" overflowY="auto" ref={containerRef}>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Emp ID</Th>
                      <Th>Name</Th>
                      <Th>Department & team</Th>
                      <Th>Designation</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {employList.map((data: any, index: any) => (
                      <>
                        <Tr
                          borderBottom="1px solid #F1F5F9"
                          _hover={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}
                          key={index}
                          className="cp"
                          onClick={() => goToTimesheet(data)}
                        >
                          <Td border="none" py="17px">
                            {data.EmpId}
                          </Td>
                          <Td border="none" py="17px" color="neutral.700 !important" fontWeight="600">
                            {data.EmpName}
                          </Td>
                          <Td border="none" py="14px">
                            {data.hasOwnProperty('DepartmentName') ? (
                              <Button
                                borderRadius="6px"
                                px="2"
                                py="1"
                                variant="solid"
                                bg="#F1F5F9"
                                _hover={{ backgroundColor: '#F1F5F9' }}
                              >
                                <Text as="span" color="neutral.600">
                                  {data?.DepartmentName}
                                </Text>
                              </Button>
                            ) : null}
                            {data?.hasOwnProperty('TeamName') ? (
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
                                  {data?.TeamName}
                                </Text>
                              </Button>
                            ) : null}
                          </Td>
                          <Td border="none" py="17px">
                            {data.Designation}
                          </Td>
                          <Td border="none" py="13px">
                            {getStatus(data?.PendingCount)}
                          </Td>
                        </Tr>
                      </>
                    ))}
                    {infinteStatus ? (
                      <Tr>
                        <Td colSpan={5} border={'none'}>
                          <Box textAlign="center">
                            <Spinner size="xl" color="red" />
                          </Box>
                        </Td>
                      </Tr>
                    ) : null}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>
      ) : null}
    </ScaleFade>
  );
};
export default ManagerTimesheetView;
