
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Flex, Box, Spacer } from '@chakra-ui/react';
import { CloseSquare } from 'iconsax-react';

const CustomModal = (props:any) => {
 const {title, isOpen, onClose, Component, size } = props; 
  return (
    <Modal closeOnOverlayClick={false}  size={size} isOpen={isOpen} onClose={onClose} >
      <ModalOverlay />
      <ModalContent>
          {
              title ?
              ( <>
            <ModalHeader px="4" py="14px">
            <Flex>
             <Box my='auto'>
             {title}
             </Box>
             <Spacer />
             <Box>
             <CloseSquare size="24" className="cp" onClick={() => onClose()} color="#CBD5E1"/>
             </Box>
            </Flex>
          </ModalHeader>
                </>
              )
              :null
          }
        <ModalBody p='0'>
          {Component}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;