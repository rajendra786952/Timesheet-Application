import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system";
const getTypography = (props?: any) => {
  return {
    fontFamily: 'Figtree',
    fontSize: props?.fontSize ? props?.fontSize :'12px',
    fontWeight: props?.fontWeight ? props?.fontWeight :'600',
    lineHeight: (props?.lineHeight ? props?.lineHeight :'18px')+'!important',
  };
};

const baseStyle = defineStyle({
    th:{
     borderBottomColor:'#E2E8F0 !important',
     ...getTypography()
    },
    td:{
     borderBottomColor:'#F1F5F9 !important',
     ...getTypography({fontSize:'14px',lineHeight:'20px',fontWeight:'500'})
    }
  })

export const TableTheme = defineStyleConfig({
    baseStyle,
    },
  );