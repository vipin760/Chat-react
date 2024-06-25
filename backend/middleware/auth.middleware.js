const jwt = require('jsonwebtoken');
const User = require('../model/user.model');

exports.authentication=async(req,res,next)=>{
    try {
        let token
        if(req.headers.authorization&&req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            const user = await User.findOne({_id:decode.id})
            if(!user){
               return res.status(401).send({message:"please login and try again"})
            }
            req.user = user
            next()
        }else{
            return res.status(401).send({message:"please login and try again"}) 
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}