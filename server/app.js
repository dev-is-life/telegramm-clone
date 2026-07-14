require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const http = require("http")

const errorMidlewere = require("./midleweres/error.midlewere")
const initSocket = require("./socket/socket")

const PORT = process.env.PORT || 4000

const app = express()
const server = http.createServer(app)

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api", require("./routes/index"))

app.use(errorMidlewere)

// Socket.io
initSocket(server)

const bootstrap = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "telegramm"
        })

        console.log("Mongo Db connected!")

        server.listen(PORT, () => {
            console.log(`Server running on ${PORT}`)
        })

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

bootstrap()