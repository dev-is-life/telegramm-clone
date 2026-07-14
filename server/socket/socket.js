const { Server } = require("socket.io")

module.exports = (server) => {

    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true
        }
    })

    let users = []

    const getSocketId = (userId) => {
        const user = users.find(user => user.user._id === userId)
        return user ? user.socketId : null
    }

    const addOnlineUser = (user, socketId) => {
        const checkUser = users.find(u => u.user._id === user._id)

        if (!checkUser) {
            users.push({
                user,
                socketId
            })
        }
    }

    io.on("connection", (socket) => {
        socket.on("addOnlineUser", user => {
            addOnlineUser(user, socket.id)
            io.emit("getOnlineUsers", users)
        })

        socket.on("sendMessage", ({ newMessage, receiver, sender }) => {
            const receiverSocketId = getSocketId(receiver._id)

            if (receiverSocketId) {
                socket.to(receiverSocketId).emit("getNewMessage", {
                    newMessage,
                    sender,
                    receiver
                })
            }
        })

        socket.on("readMessage", ({ receiver, messages }) => {
            const receiverSocketId = getSocketId(receiver._id)

            if (receiverSocketId) {
                socket.to(receiverSocketId).emit("getReadMessage", messages)
            }
        })

        socket.on("updateMessage", ({ updateMessage, sender, receiver }) => {
            const receiverSocketId = getSocketId(receiver._id)

            if (receiverSocketId) {
                socket.to(receiverSocketId).emit("getUpdateMessage", {
                    newMessage: updateMessage,
                    sender
                })
            }
        })

        socket.on("deleteMessage", ({ deleteMessage, sender, receiver, filteredMessage }) => {
            const receiverSocketId = getSocketId(receiver._id)

            if (receiverSocketId) {
                socket.to(receiverSocketId).emit("getDeleteMessage", {
                    newMessage: deleteMessage,
                    sender,
                    filteredMessage
                })
            }
        })

        socket.on("typing", ({ sender, receiver, message }) => {
            const receiverSocketId = getSocketId(receiver._id)

            if (receiverSocketId) {
                socket.to(receiverSocketId).emit("getTyping", {
                    sender,
                    message
                })
            }
        })

        socket.on("createContact", ({ currentUser, receiver }) => {
            const receiverSocketId = getSocketId(receiver._id)

            if (receiverSocketId) {
                socket.to(receiverSocketId).emit("getCreateUser", currentUser)
            }
        })

        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id)

            users = users.filter(u => u.socketId !== socket.id)

            io.emit("getOnlineUsers", users)
        })

    })

}