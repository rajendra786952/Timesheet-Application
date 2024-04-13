import { useAppSelector } from "@/app/store";
import userSchema, { UserSchema } from "@/app/validations/user";
import { Box, Button, Flex, Input, InputGroup, InputRightElement, ScaleFade,Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar2, ExportCurve, Trash, User } from "iconsax-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';

const Setting = () => {
    const { user } = useAppSelector<any>((state) => state.user);
    const customStyles = {
        control: (styles:any, { isDisabled }:{isDisabled:any}) => ({
          ...styles,
          backgroundColor: isDisabled ? '#F8FAFC' : '#F8FAFC',
          borderRadius:'10px',
          border:'none',
          color:isDisabled ? '#1E293B' :'#1E293B'
        }),
        singleValue:(styles:any) => ({
        ...styles,
        color:'#1E293B',
        padding:'2px 8px',
        margin:'0px'
        })
      };

    const options = [
        { value: 'Software developer - L1', label: 'Software developer - L1' },
        { value: 'Mohit Tanwar', label: 'Mohit Tanwar' },
        { value: 'Product', label: 'Product' },
        { value:'Engineering',label:'Engineering'}
      ];
    const getValue = (key:any) => {
     return user.hasOwnProperty(key) ? user[key] : '';
    }
      const { control, setValue, getValues, reset,handleSubmit,formState:{ errors }, setError} = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
          DepartmentName:{value:getValue('DepartmentName'),label:getValue('DepartmentName')},
          Designation:{value:getValue('Designation'),label:getValue('Designation')},
          EmpId:getValue('EmpId') ,
          EmpName:getValue('EmpName'),
          Role:{value:getValue('Role'),label:getValue('Role')},
          TeamName:{ value: getValue('TeamName'), label: getValue('TeamName') },
          EmpEmail:'demo@gmail.com',
          EmpDate:'20 Dec 2021',
          EmpManager:{ value: 'Mohit Tanwar', label: 'Mohit Tanwar' }
        },
      });

    const getTitle = (title:any) => {
        return (
            <Box pb="1">
                <Text as="span" textStyle={'rgMedium'} color="neutral.700">
                  {title}
                </Text>
              </Box>
        )
    }
    const getInputBox = (title:any,value:any,pl='0') => {
        return (
            <Box w="399px" maxW={'399px'} pl={pl}>
              {
                  getTitle(title)
              }
              <Box>
                <Input
                  {...value}
                  readOnly
                  p="3"
                  bg="neutral.100"
                  color="neutral.700"
                  borderRadius="10px"
                  border="none"
                />
              </Box>
            </Box>
        );
    }
    const selectBox = (field:any) => {
      return (
        <Box>
          <Select
            {...field}
            isDisabled
            styles={customStyles}
            options={options}
          />
        </Box>
      );
    }
 

  const onSubmit = (data:any) => {
    // Handle form submission
  };

    return (
      <ScaleFade in initialScale={0.6}>
        <>
          <Box px="8" height='calc(100vh - 82px)' overflowY={'auto'}>
            <Box>
              <Text as="span" color={'green.900'} fontSize="24px" lineHeight="32px" fontWeight="700">
                Settings
              </Text>
            </Box>
            <Box pt="6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box pb="7">
                  <Flex>
                    <Box>
                      <Box p="15.7px" bg="#F1F0FF" borderRadius="50%">
                        <User size="36.6" color="#5A50E0" variant="Bulk" />
                      </Box>
                    </Box>
                    <Box pl="6" alignItems="center" display="flex">
                      <Button
                        leftIcon={<ExportCurve size="20" color="#fff" />}
                        bg={'#5A50E0'}
                        variant="solid"
                        textStyle="rgMedium"
                      >
                        Upload profile photo
                      </Button>
                    </Box>
                    <Box ml="2" alignItems="center" display="flex">
                      <Box p="3" borderRadius="10px" border="1px solid #DC2626">
                        <Trash size="20" color="#DC2626" />
                      </Box>
                    </Box>
                  </Flex>
                </Box>
                <Box>
                  <Flex mb="7">
                    <Controller
                      name="EmpName"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Username is required' }}
                      render={({ field }:{field:any}) => getInputBox('Your name', field)}
                    />
                    <Controller
                      name="EmpEmail"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Email is required' }}
                      render={({ field }:{field:any}) => getInputBox('Email ID', field, '20px')}
                    />
                  </Flex>
                  <Flex mb="7">
                  <Controller
                      name="EmpId"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Employee code is required'}}
                      render={({ field }:{field:any}) => getInputBox('Employee code', field)}
                    />
                    <Box w="399px" maxW={'399px'} pl={'20px'}>
                      {getTitle('Date of joining')}
                      <Box>
                      <Controller
                      name="EmpDate"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Joining date is required'}}
                      render={({ field }) =>
                      <InputGroup>
                          <Input
                            {...field}
                            readOnly
                            p="3"
                            bg="neutral.100"
                            color="neutral.700"
                            borderRadius="10px"
                            border="none"
                          />
                          <InputRightElement>
                            <Calendar2 size="20" color="#94A3B8" />
                          </InputRightElement>
                        </InputGroup>  
                    }
                    />
                      </Box>
                    </Box>
                  </Flex>
                  <Flex mb="7">
                    <Box w="399px" maxW={'399px'}>
                      {getTitle('Designation')}
                      <Controller
                      name="Designation"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Designation is required'}}
                      render={({ field }:{field:any}) => selectBox(field)}
                    />
                    </Box>
                    <Box w="399px" maxW={'399px'} pl={'20px'}>
                      {getTitle('Manager name')}
                      <Controller
                      name="EmpManager"
                      control={control}
                      defaultValue=""
                      rules={{ required: 'Employ manager is required'}}
                      render={({ field }:{field:any}) => selectBox(field)}
                    />
                    </Box>
                  </Flex>
                  <Flex mb="7">
                    <Box w="399px" maxW={'399px'}>
                      {getTitle('Team name')}
                      <Controller
                      name="TeamName"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Employ's manager is required"}}
                      render={({ field }:{field:any}) => selectBox(field)}
                    />
                    </Box>
                    <Box w="399px" maxW={'399px'} pl={'20px'}>
                      {getTitle('Department name')}
                      <Controller
                      name="DepartmentName"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Department Name is required"}}
                      render={({ field }:{field:any}) => selectBox(field)}
                    />
                    </Box>
                  </Flex>
                  <Flex mb="7">
                    <Box width="798px" maxWidth={'798px'}>
                      {getTitle('Assign roles')}
                      <Controller
                      name="Role"
                      control={control}
                      defaultValue=""
                      rules={{ required: "Role is required"}}
                      render={({ field }:{field:any}) => selectBox(field)}
                     />
                    </Box>
                  </Flex>
                </Box>
              </form>
            </Box>
          </Box>
        </>
      </ScaleFade>
    );
}

export default Setting;