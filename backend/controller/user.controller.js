const User = require("../model/user.model");
const bcrypt = require("bcrypt");
const sendToken = require("../utils/jwtToken");

exports.userRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({ message: "please enter all fileds" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    req.body.password = hashPassword;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).send({ message: "user already exist" });
    }
    const userSave = new User(req.body);
    await userSave.save().then((data) => {
      res.status(200).send({ message: "user registered completed" });
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email: email });
    if (!userExist) {
      return res.status(400).send({ message: "incorrect email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, userExist.password);
    if (!passwordMatch) {
      return res.status(400).send({ message: "incorrect email or password" });
    }
    const token = sendToken(userExist._id);
    let data ={
      _id:userExist._id,
      token:token,
      name:userExist.name,
      email:userExist.email,
      pic:userExist.pic
    }
    console.log(data)
    res.status(200).send({ message: "Login success", data:data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

////////////////get all users////////////////////////////////

exports.getAllUsers = async(req,res)=>{
  try {
    const keyword = req.query.search?{
      $or:[
        {name:{$regex:req.query.search, $options:"i"}},
        {email:{$regex:req.query.search, $options:"i"}},
      ]
    }:{}
    const users = await User.find(keyword).find({_id:{$ne:req.user._id}})
    res.status(200).send({data:users})

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}