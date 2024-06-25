import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import UserBadgeItem from "../UserBadgeItem/UserBadgeItem";
import axios from "axios";
import { USER_API_URI } from "../../../api";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const toast = useToast();

  const handleRemove = () => {};

  const handleRemoveUser = async (u) => {
    if (selectedChat.groupAdmin._id !== user._id && u._id !== user._id) {
      toast({
        title: `Only Admin Admin can remove ...!`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
      const { data } = await axios.put(
        `${USER_API_URI}/chat/remove-group`,
        { chatId: selectedChat._id, userId: u._id },
        config
      );
      console.log(data)
      u._id === user._id ? selectedChat() : setSelectedChat(data.data);
      setFetchAgain(!fetchAgain);
      fetchMessages()
      setLoading(false);
    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${USER_API_URI}/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data.data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setRenameLoading(false);
      return;
    }
    setGroupChatName("");
  };

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
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: `User Already in Group`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: `Only Admin Can Add Members`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${USER_API_URI}/chat/add-group`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      console.log(data);
      setSelectedChat(data.data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  return (
    <>
      <IconButton
        onClick={onOpen}
        onClose={onClose}
        icon={<ViewIcon />}
        display={"flex"}
      ></IconButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <Box width={"100%"} pb={3} display={"flex"} flexWrap={"wrap"}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={()=>handleRemoveUser(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"} alignContent={"center"}>
              <Input
                m={"1"}
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                color={"white"}
                m={"1"}
                isLoading={renameLoading}
                bg={"gray"}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                m={"1"}
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              <>
                <Box width={"100%"} m={1}>
                  {searchResult?.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    ></UserListItem>
                  ))}
                </Box>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => handleRemove(user)}
              color={"white"}
              bg={"gray"}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
