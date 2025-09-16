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
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Trust proxy in production so Secure cookies and protocol detection work behind Render's proxy
if (process.env.NODE_ENVIRONMENT === "production") {
    app.set("trust proxy", 1);
}

// ✅ Explicit allowlist for your Render apps (frontend + backend)
const allowedOrigins = [
    "http://localhost:5173", // local dev
    "https://socialnetworking-1.onrender.com", // frontend on Render
];

// Shared origin checker for HTTP and Socket.IO
function originChecker(origin, callback) {
    if (!origin) return callback(null, true); // allow tools like Postman
    if (allowedOrigins.includes(origin)) {
        return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
}

// HTTP middleware
app.use(
    cors({
        origin: originChecker,
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/connection", connectionRouter);

// Socket.IO with same CORS config
export const io = new Server(server, {
    cors: {
        origin: originChecker,
        credentials: true,
    },
});

// In-memory socket maps
export const userSocketMap = new Map();
export const socketUserMap = new Map();

io.on("connection", (socket) => {
    socket.on("register", (userId) => {
        userSocketMap.set(userId, socket.id);
        socketUserMap.set(socket.id, userId);
    });

    socket.on("disconnect", () => {
        const userId = socketUserMap.get(socket.id);
        if (userId) {
            userSocketMap.delete(userId);
            socketUserMap.delete(socket.id);
        }
    });
});

server.listen(PORT, () => {
    connectDB();
    console.log(`Server listening at port ${PORT}`);
});
