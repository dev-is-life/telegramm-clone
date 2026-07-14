const BaseError = require("../errors/base.errors")
const { CONST } = require("../lib/constatnts")
const messageModel = require("../models/message.model")
const userModel = require("../models/user.model")
const mailService = require("../service/mail.service")

class UserController {
    // [GET] Requests
    async getContacts(req, res, next){
        try {
            const userId = req.user._id

            const contacts = await userModel.findById(userId).populate("contacts")
            const allContacts = contacts.contacts.map(contact => contact.toObject())

            for(const contact of allContacts){
                const lastMessage = await messageModel.findOne({ $or: [
                    { sender: userId, receiver: contact._id },
                    { sender: contact._id, receiver: userId }
                ]}).populate({ path: "sender", select: "email" }).populate({ path: "receiver", select: "email" }).sort({ createdAt: -1 })

                contact.lastMessage = lastMessage
            }

            return res.status(200).json({ contacts: allContacts })
        } catch (error) {
            next(error)
        }
    }

    async getMessages(req, res, next){
        try {
            const user = req.user._id
            const { contactId } = req.params

            const messages = await messageModel.find({ $or: [
                { sender: user, receiver: contactId },
                { sender: contactId, receiver: user }
            ]})
            .populate({ path: "sender", select: "email"})
            .populate({ path: "receiver", select: "email"})

            await messageModel.updateMany({ sender: contactId, receiver: user, status: CONST.SENT }, { status: CONST.READ })
            res.status(200).json({ messages })
        } catch (error) {
            next(error)
        }
    }

    // [POST] Requests
    async createMessage(req, res, next){
        try {
            const userId = req.user._id
            const newMessage = await messageModel.create({ ...req.body, sender: userId })
            const currentMessage = await messageModel.findById(newMessage._id)
            .populate({ path: "sender" })
            .populate({ path: "receiver" })
            const receiver = await userModel.findById(newMessage.receiver)
            const sender = await userModel.findById(newMessage.sender)
            res.status(201).json({ newMessage: currentMessage, sender, receiver })
        } catch (error) {
            next(error)
        }
    }

    async messageRead(req, res, next){
        try {
            const { messages } = req.body
            const allMessages = []

            for(const message of messages){
                const updatedMessage = await messageModel.findByIdAndUpdate(message._id, { status: CONST.READ }, { new: true })
                allMessages.push(updatedMessage)
            }

            res.status(200).json({ messages: allMessages })
        } catch (error) {
            next(error)
        }
    }

    async createContact(req, res, next){
        try {
            const { email } = req.body
            const userId = req.user._id
            
            const user = await userModel.findById(userId) 
            
            const contact = await userModel.findOne({ email })
            if(!contact){
                throw BaseError.BadRequest("User doesn't exist!")
            }
            
            if(user.email === contact.email) throw BaseError.BadRequest("You cannot add yourself as a contact!")
            
            const existingContact = await userModel.findOne({ _id: userId, contacts: contact._id}) 
            if(existingContact) throw BaseError.BadRequest("Contact already exists!")

            await userModel.findByIdAndUpdate(userId, { $push: { contacts: contact._id }}, { new: true })
            const currentUser = await userModel.findByIdAndUpdate(contact._id, { $push: { contacts: userId }})

            return res.status(201).json({ message: "Contact added succesfully!", contact: currentUser })
        } catch (error) {
            next(error)
        }
    }

    async createReaction(req, res, next){
        try {
            const { messageId, reaction } = req.body
            const updatedMessage = await messageModel.findByIdAndUpdate(messageId, { reaction }, { new: true })
            res.status(201).json({ updatedMessage })
        } catch (error) {
            next(error)
        }
    }

    async sendOtp(req, res, next){
        try {
            const { email } = req.body
            const existingUser = await userModel.findOne({ email })
            if(existingUser){
                throw BaseError.BadRequest("User with this email doesn't exist!")
            }
            await mailService.sendOtp(email)
            res.status(200).json({ email })
        } catch (error) {
            next(error)
        }
    }

    // [PUT] Requests
    async updateMessage(req, res, next){
        try {
            const { messageId } = req.params
            const { text } = req.body
            const updatedMessage = await messageModel.findByIdAndUpdate(messageId, { text }, { new: true })
            res.status(200).json({ updatedMessage }) 
        } catch (error) {
            next(error)
        }
    }

    async updateEmail(req, res, next){
        try {
            const { email, otp } = req.body
            const result = await mailService.verifyOtp(email, otp)
            if(result){
                const userId = req.user._id
                const user = await userModel.findByIdAndUpdate(userId, { email }, { new: true   })
                return res.status(200).json({ user })
            }
            return res.status(400).json({ message: "Otp incorrect!"})
        } catch (error) {
            next(error)
        }
    }

    async updateProfile(req, res, next){
        try {
            const {...payload } = req.body

            await userModel.findByIdAndUpdate(req.user._id, payload) 
            res.status(200).json({ message: "Profile updated succesfully!" })
        } catch (error) {
            next(error)
        }
    }

    // [DELETE] Requests
    async deleteMessage(req, res, next){
        try {
            const { messageId } = req.params
            const deletedMessage = await messageModel.findByIdAndDelete(messageId)
            return res.status(200).json({ deletedMessage })
        } catch (error) {
            next(error)
        }
    }

    async deleteUser(req, res, next){
        try {
            const userId = req.user._id
            const deletedUser = await userModel.findByIdAndDelete(userId)
            res.status(200).json({ message: "User deleted succesfully!" })
        } catch (error) {
            next(error)       
        }
    }
}


module.exports = new UserController()