const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/database')
const app = express()
dotenv.config({path:"./config/.env"})
const port = process.env.PORT
connectDB()

app.listen(port,()=>{
    console.log("server connected on port ...",process.env.PORT);
})