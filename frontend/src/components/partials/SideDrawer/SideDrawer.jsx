import {
  Tooltip,
  Box,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import React, { useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import ProfileModel from "../ProfileModel/ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_URI } from "../../../api";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../../config/chatLogic";
import { Badge } from 'customizable-react-badges';

const SideDrawer = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const toast = useToast();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
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
      const { data } = await axios.get(
        `${USER_API_URI}/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data.data);
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

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `${USER_API_URI}/chat`,
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data.data._id))
        setChats([data.data, ...chats]);
      setSelectedChat(data.data);
      setLoading(false);
      onClose();
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
  return (
    <>
      {/* navbar start */}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"#718096"}
        width={"100%"}
        padding={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search User to Chat" hasArrow placeContent={""}>
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={"4"}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"fantasy"}>
          COOL-CHAT
        </Text>
        <div>
          <Menu>
            <MenuButton p={"1"}>
            <Badge content={notification.length} contentColor="#ffffff" { ...(notification.length !== 0? { hideZero:true}:{hideZero:true}) } >
            <BellIcon margin={"1"} fontSize={"2xl"} />
            </Badge>
            </MenuButton>
            <MenuList pl={2}>{!notification.length&&"No New Messages"}
              {notification.map((notif)=>(
                <MenuItem key={notif._id} onClick={()=>{
                  setSelectedChat(notif.chat);
                 setNotification(notification.filter((n)=>n !==notif))
                } }>
                  {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`:`New Message from ${getSender(user,notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      {/* navbar end */}

      <Drawer onClose={onClose} isOpen={isOpen} placement="left">
        <DrawerOverlay />
        <DrawerContent bg={"#A0AEC0"}>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={"2"}>
              <Input
                placeholder="Search Name or Email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <Box
                width={"100%"}
                height={"50vh"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Spinner color="red.500" />
              </Box>
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
