const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/database')
const { chats } = require('./data')
const cors = require('cors')
const app = express()
dotenv.config({path:"./config/.env"})
connectDB()

app.use(cors())
app.use(express.json())

const port = process.env.PORT

///routes
const user_router = require('./routes/user.routes')
const chat_router = require('./routes/chat.routes');
const message_router = require('./routes/message.routes');
app.use('/api/v2/user',user_router)
app.use('/api/v2/chat', chat_router);
app.use('/api/v2/message',message_router);

const server = app.listen(port,()=>{
    console.log("server connected on port ...",process.env.PORT);
})

const io = require('socket.io')(server, {
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:5173"
    }
})

io.on("connection",(socket)=>{
    console.log("connected to socket.io");
    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        socket.emit("connected");
    })
    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("user joined room"+room);
    })

    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));

    socket.on("new message",(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;
        if(!chat.users) return console.log("chat users not defined");

        chat.users.forEach((user)=>{
            if(user._id == newMessageRecieved.sender._id) return
            socket.in(user._id).emit("message recieved",newMessageRecieved)
        })
    })
})