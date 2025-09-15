import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import connectionRouter from "./routes/connection.routes.js";
import postRouter from "./routes/post.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();
const app = express();
let server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

let port = process.env.PORT || 5000;

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/connection", connectionRouter);

export const userSocketMap = new Map();
export const socketUserMap = new Map();

io.on("connection", (socket) => {
    // console.log("user connected", socket.id);
    socket.on("register", (userId) => {
        userSocketMap.set(userId, socket.id);
        socketUserMap.set(socket.id, userId);
        // console.log(userSocketMap);
    });
    socket.on("disconnect", () => {
        const userId = socketUserMap.get(socket.id);
        if (userId) {
            userSocketMap.delete(userId);
            socketUserMap.delete(socket.id);
            // console.log(`User ${userId} disconnected and removed from map`);
        }
        // console.log("disconnected", socket.id);
    });
});
server.listen(port, () => {
    connectDB();
    console.log(`Server start listening at port ${port}`);
});
