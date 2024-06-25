import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../../config/chatLogic";
import { ChatState } from "../../../Context/ChatProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((items, idx) => (
          <div style={{ display: "flex" }} key={items._id}>
            {(isSameSender(messages, items, idx, user._id) ||
              isLastMessage(messages, idx, user._id)) && <Tooltip label={items.sender.name} placement="bottom-start" hasArrow>
                <Avatar mt={'7px'} mr={"1"} size={"sm"} cursor={"pointer"} name={items.sender.name} src={items.sender.pic} />
                </Tooltip>}
                <span style={{ backgroundColor:`${items.sender._id === user._id ? "#BEE3F8":"#B9F5D0"}`, 
            borderRadius:"20px",
            padding:"5px 15px",
            maxWidth:"75%",
            marginLeft:isSameSenderMargin(messages,items,idx,user._id),
            marginTop:isSameUser(messages,items,idx,user._id)?3 : 10,
            }}>{items.content}</span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
