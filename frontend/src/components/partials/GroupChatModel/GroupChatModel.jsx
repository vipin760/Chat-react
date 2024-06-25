import { useDisclosure } from "@chakra-ui/hooks";
import {
    Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import { USER_API_URI } from "../../../api";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserBadgeItem/UserBadgeItem";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${USER_API_URI}/user?search=${search}`,
        config
      );
      setLoading(false);
      setsearchResult(data.data);
    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  };
  const handleSubmit = async() => {
    if(!groupChatName || !selectedUsers){
        toast({
            title: `Please fill all fields`,
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
          return;
    }
    try {
        setLoading(true)
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post(`${USER_API_URI}/chat/group`,{
            name:groupChatName,
            users:JSON.stringify(selectedUsers.map((u)=>u.id))
          },config)

          setLoading(false)
          setChats([data.data,...chats])
          onClose()
          toast({
            title: `New Group chat is created`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;

    } catch (error) {
        setLoading(false)
        toast({
            title: `${error.response.data.message}`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
          return;
    }
  };

  const handleGroup = (userToAdd) => {
   if(selectedUsers.includes(userToAdd)){
    toast({
        title:"User Already Added",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top",
    })
    return
   }
   setSelectedUsers([...selectedUsers, userToAdd])
    console.log(userToAdd)
  };
  const handleDelete = (deleteUser) =>{
    setSelectedUsers(selectedUsers.filter(sel=> sel._id !== deleteUser._id))
  }
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create a Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users name"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* selected users search */}
            <Box width={"100%"} display={"flex"} flexWrap={"wrap"}>
           {
            selectedUsers.map((items,idx)=>(
                <UserBadgeItem key={idx} user={items} handleFunction={()=>handleDelete(items)}/>  
            ))
           }
           </Box>
            {/* render search users */}
            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                 <Box width={"100%"} key={user._id}>
                     <UserListItem mr={1}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                 </Box>
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button color={"white"} bg={"gray"} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
