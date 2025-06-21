import express from 'express';
import cors from 'cors';
import http from "http";
import { Server } from 'socket.io';
import { connectionDB } from './lib/db.js';
import dotenv from "dotenv";
import userRoute from './routes/userRoutes.js';
import messageRouter from './routes/messageRouter.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server,{
    cors:{origin:"*"}
})

app.use(express.json({ limit: "4mb" }));
app.use(cors());

await connectionDB();

export const userSocketMap = {};
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("user Connected",userId);

    if(userId){
        userSocketMap[userId] = socket.id;
        
    }
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on('disconnect',()=>{
        console.log("User Disconnected",userId)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
        

    })

})

app.post('/api/status', (req, res) => {
    console.log("server is live");
    res.json("Server is live");
});

app.use("/api/messages",messageRouter);

app.use("/api/auth", userRoute);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
