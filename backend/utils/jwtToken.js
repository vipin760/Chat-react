const jwt =require('jsonwebtoken')

const sendToken = (id) =>{
    const token = jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE*12*60*60*1000})
    return token
}

module.exports = sendToken