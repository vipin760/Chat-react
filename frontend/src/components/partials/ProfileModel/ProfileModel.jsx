import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalFooter, Image, Text} from '@chakra-ui/react'
import { Button } from "@chakra-ui/button"
import { useDisclosure } from "@chakra-ui/hooks"
import React from 'react'

const ProfileModel = ({user, children}) => {
    const { isOpen, isClose, onClose,onOpen } = useDisclosure();

  return (
    <>
     {
        children?(<span onClick={onOpen}>{children}</span>):(<IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>)
     } 
     <Modal size={'lg'} isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay>
        <ModalContent h={'450px'}>
            <ModalHeader fontSize={'40px'} display={'flex'} justifyContent={'center'}>
               {user.name}
            </ModalHeader>
            <ModalCloseButton onClick={onClose}/>
            <ModalBody display={'flex'} flexDir={"column"} alignItems={'center'} justifyContent={"space-between"}>
               <Image borderRadius={'full'} src={user.pic} boxSize={'150px'} alt={user.name} />
               <Text fontSize={{base:"28px",md:"30px"}}>
                Email:{user.email}
               </Text>
            </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={"3"} onClick={onClose}>
                        close
                    </Button>
                    <Button variant={'ghost'}>Secondary Action</Button>
                </ModalFooter>
        </ModalContent>
    </ModalOverlay>
     </Modal>
    </>
  )
}

export default ProfileModel
