const AuthController = require("../controllers/auth-controller")
const userController = require("../controllers/user.controller")
const authMidlewere = require("../midleweres/auth.midlewere")
const router = require("express").Router()

require("express-group-routes")

router.post("/auth/login",  AuthController.login)
router.post("/auth/verify",  AuthController.verify)

router.get("/user/messages/:contactId", authMidlewere, userController.getMessages)
router.get("/user/contacts", authMidlewere, userController.getContacts)

router.post("/user/message", authMidlewere, userController.createMessage)
router.post("/user/message-read", authMidlewere,  userController.messageRead)
router.post("/user/contact", authMidlewere, userController.createContact)
router.post("/user/reaction", authMidlewere, userController.createReaction)
router.post("/user/send-otp", authMidlewere, userController.sendOtp)

router.put("/user/message/:messageId", authMidlewere, userController.updateMessage)
router.put("/user/profile", authMidlewere, userController.updateProfile)
router.put("/user/email", authMidlewere, userController.updateEmail)

router.delete("/user/message/:messageId", authMidlewere, userController.deleteMessage)
router.delete("/user", authMidlewere, userController.deleteUser)


module.exports = router 