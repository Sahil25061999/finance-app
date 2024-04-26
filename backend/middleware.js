const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('./config')
const { User } = require('./db')

async function authMiddleware(req,res,next){
  try{
    const autherizationHeader = req.headers.authorization
    const token = autherizationHeader.split(" ")[1]
    const decodedToken = jwt.verify(token,JWT_SECRET)
    const user = await User.findOne({username:decodedToken.username})

    if(!user){
      res.status(404).json({
        success:false,
        message:"User not found!"
      })
    }
    req.headers.userId = user._id
    next()
  }catch(e){
    next(e)
  }
}

module.exports = {
  authMiddleware
}