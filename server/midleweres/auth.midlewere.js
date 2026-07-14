const BaseError = require("../errors/base.errors")
const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

module.exports = async function(req, res, next) {
    try {
        const authorization = req.headers.authorization
        if(!authorization){
            return next(BaseError.Unauthorize())
        }

        const token = authorization.split(" ")[1]
        if(!token){
            return next(BaseError.Unauthorize())
        }

        
        const { userId }  = await jwt.verify(token, process.env.JWT_SECRET)
        if(!userId){
            return next(BaseError.Unauthorize())
        }

        const user = await User.findById(userId)
        if(!user){
            return next(BaseError.Unauthorize())
        }
        req.user = user
        next()
    } catch (error) {
        
    }
}