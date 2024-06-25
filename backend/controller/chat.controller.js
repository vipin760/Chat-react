const Chat = require("../model/chat.models");
const User = require("../model/user.model");

exports.accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400);
    }
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      return res.status(200).send({ data: isChat[0] });
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
    }

    const createdChat = await Chat.create(chatData);
    await Chat.findOne({ _id: createdChat._id })
      .populate("users", "-password")
      .then((data) => {
        return res.status(200).send({ data: data });
      })
      .catch((error) => {
        res.status(500).send({ message: error.message });
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
//////////////////////////////////////////////////////////////////////////////
exports.fetchChats = async (req, res) => {
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        return res.status(200).send({ data: result });
      });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////
exports.createGroupChat = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "please fill all fields" });
    }
    var users = JSON.parse(req.body.users);
    console.log(users)
    if (users.length < 2) {
      return res
        .status(400)
        .send({ message: "more than 2 members required to create group chat" });
    }
    users.push(req.user);

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (fullGroupChat) {
      return res.status(200).send({ data: fullGroupChat });
    }
  } catch (error) {
    // console.log(error.message)
    res.status(500).send({ message: error.message });
  }
};

exports.renameGroup = async (req, res) => {
  try {
    const { chatId, chatName} = req.body
    const updatedChat = await Chat.findByIdAndUpdate(chatId,{ chatName },{new:true}).populate("users","-password").populate("groupAdmin","-password")
    if(!updatedChat){
        res.status(404).send({message:"chat not found"})
    }else{
        res.status(200).send({data:updatedChat})
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.addGroup = async (req, res) => {
    try {
        const { chatId, userId} = req.body
        console.log(req.body)
        const added = await Chat.findByIdAndUpdate(chatId,{
            $push:{users:userId}
        },{
            new:true
        }).populate("users", "-password").populate("groupAdmin","-password")
        if(!added){
            res.status(404).send({message:"chat not found"})
        }else{
            res.status(200).send({data:added})
        }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.removeGroup = async (req, res) => {
  console.log("working")
  try {
    const { chatId, userId } = req.body
    const removed = await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId}
    },{new:true}).populate("users","-password").populate("groupAdmin","-password")
    if(!removed){
        res.status(404).send({message:"chat not found"})
    }else{
        res.status(200).send({data:removed})
    }
    
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
