import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import "./Chat.css";
import { ChatState } from "../../../Context/ChatProvider";
import SideDrawer from "../../partials/SideDrawer/SideDrawer";
import MyChat from "../../partials/MyChat/MyChat";
import ChatBox from "../../partials/ChatBox/ChatBox";
const Chat = () => {
  const [chats, setChats] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  useEffect(() => {}, []);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        width={"100%"}
        height={"91.5vh"}
        p={"10px"}
        bg={"#718096"}
      >
        {user && (
          <MyChat fetchAgain={fetchAgain} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chat;
