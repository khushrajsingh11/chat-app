import mongoose from "mongoose";
import dotenv from "dotenv";
export const connectionDB = async ()=>{
    try {
        mongoose.connection.on('connected',()=>console.log('Database Connected'));
       await mongoose.connect(`${process.env.MONGO_DB}/chat-app`)
    } catch (error) {
        console.log(error);
    }
}