const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    pic:{
        type:String,
        required:true,
        default:"https://cdn.pixabay.com/photo/2014/03/24/17/19/teacher-295387_640.png"
    }
},{
    timestamps:true
})

const User = mongoose.model("User",userSchema);
module.exports = User

