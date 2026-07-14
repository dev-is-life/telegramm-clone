import mongoose from "mongoose"

let isConnected: boolean = false

export const connectToDatabase = async () => {

    if(!process.env.MONGO_URI){
        return console.error("Mongo url is not defined!")
    }

    if(isConnected){
        return 
    }

    try {
        await mongoose.connect(process.env.MONGO_URI!, { dbName: "telegramm" })
        isConnected = true
    } catch (error) {
        console.log("Error connecting to database!");
    }
}