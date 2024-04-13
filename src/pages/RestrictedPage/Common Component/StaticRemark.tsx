import { Box, Text } from "@chakra-ui/react";
import { MessageText } from "iconsax-react";

const StaticRemark = (props:any) =>{
    const { text , button } = props;
    return (
        <Box w="287px" position="absolute" zIndex="1" className="hoverBox">
            <Box
              px="14px"
              pb="4"
              pt="10px"
              bg="white"
              boxShadow="0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)"
              borderRadius="xl"
              border="1px solid #F1F5F9"
            >
              <Box display="flex">
                <Text as="span">
                  <MessageText size="16" color="#D97706" />
                </Text>
                <Text ml="6px" as="span" color="warning.400" textStyle="smMedium">
                  Remark
                </Text>
              </Box>
              <Box mt="6px" borderRadius="10px">
                <Text as="span" color="neutral.700" textStyle="rgRegular">
                  {text}
                </Text>
              </Box>
              <Box  borderRadius="10px">
                {button}
              </Box>
            </Box>
          </Box>
    )
}

export default StaticRemark;