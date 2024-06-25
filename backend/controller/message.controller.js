const Chat = require("../model/chat.models")
const Message = require("../model/message.model")
const User = require("../model/user.model")

exports.sendMessage=async(req,res)=>{
    try {
        const { content, chatId} = req.body
        console.log(req.body)
        if(!content || !chatId){
            return res.status(400).send({message:"oops...! missing something"})
        }
        var newMessage = {
            sender:req.user._id,
            content:content,
            chat:chatId
        }
        var message = await Message.create(newMessage);

        message = await message.populate("sender","name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path:"chat.users",
            select:"name pic email"
        });

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        })
        res.status(200).send({data:message});
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message:`${error.messsage}`})
    }
}

exports.allMessage=async(req,res)=>{
    try {
        const messages = await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat");
        res.status(200).send({data:messages})
        
    } catch (error) {
        res.status(500).send({message:`${error.messsage}`})
    }
}