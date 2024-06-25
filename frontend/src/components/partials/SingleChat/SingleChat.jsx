import React, { useEffect, useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import "./SingleChat.css"
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../../config/chatLogic";
import ProfileModel from "../ProfileModel/ProfileModel";
import UpdateGroupChatModal from "../UpdateGroupChatModal/UpdateGroupChatModal";
import axios from "axios";
import { END_POINT, USER_API_URI } from "../../../api";
import ScrollableChat from "../ScrollableChat/ScrollableChat";
import io from 'socket.io-client'
import Typing from "../Typing/Typing";

var socket , selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [ socketConnected, setSocketConnected] = useState(false);
  const [ typing, setTyping] = useState(false)
  const [ isTyping, setIsTyping] = useState(false)

  const { user, selectedChat, setSelectedChat ,notification, setNotification} = ChatState();

  const toast = useToast()

  useEffect(()=>{
    fetchMessages()
    selectedChatCompare = selectedChat
  },[selectedChat])

  useEffect(()=>{
    socket = io(END_POINT)
    socket.emit("setup",user);
    socket.on("connected",()=>setSocketConnected(true))
    socket.on("typing",()=>setIsTyping(true));
    socket.on("stop typing",() => setIsTyping(false))
  },[])

  useEffect(()=>{
    socket.on("message recieved",(newMessageRecieved)=>{
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
        // give notification
        if(!notification.includes(newMessageRecieved)){
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain)
        }
      }else{
        setMessages([...messages, newMessageRecieved])
      }
    })
  })
  const fetchMessages = async() => {
    if(!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true)
      const { data } = await axios.get(`${USER_API_URI}/message/${selectedChat._id}`,config);
      setMessages(data.data)
      setLoading(false)
      socket.emit("join chat",selectedChat._id)
      
    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false)
      return
      
    }
  }

  const sendMessage = async(e) => {
    if(e.key==="Enter" && newMessage){
      socket.emit('stop typing',selectedChat._id)
      try {
        const config = {
          headers: {
            'Content-Type':'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("")
        const { data } = await axios.post(`${USER_API_URI}/message`,{content:newMessage,chatId:selectedChat._id},config);
        setMessages([...messages,data.data])
        socket.emit("new message",data.data)
      } catch (error) {
        toast({
          title: `${error.response.data.message}`,
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if(!socketConnected) return;
    if(!typing){
      setTyping(true);
      socket.emit("typing",selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(()=>{
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime
      if(timeDiff>=timerLength && typing){
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    },timerLength)
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            width={"100%"}
            height={"100%"}
            borderRadius={"lg"}
            overflow={"hidden"}
          >
            {/* Messaged here */}
            {loading ? (
              <Spinner
                w={20}
                h={20}
                size={"xl"}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="message">
                  <ScrollableChat messages={messages}/>
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              { isTyping?(<Box><Typing/></Box>):(<></>)}
              <Input
                variant={"filled"}
                bg={"#E0E0E0"}
                placeholder="Enter a message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h="100%"
        >
          <Text fontSize={"3xl"} pb={3}>
            Click on o user to start Chatting{" "}
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
