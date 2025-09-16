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
} // Express recommends enabling trust proxy when behind proxies for correct secure cookies and scheme detection [web:69][web:30]

// Explicit allowlist plus a regex to allow Vercel preview deployments
const allowedOrigins = [
    "http://localhost:5173",
    "https://social-networking-fcet8te3d-yogesh-ranas-projects-8c9615bd.vercel.app",
    "https://social-networking-iota.vercel.app",
]; // Keep exact hostnames without trailing slashes; arrays are supported by cors middleware [web:20][web:12]

const vercelPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i; // allow preview URLs safely [web:12]

// Shared origin checker for HTTP and Socket.IO
function originChecker(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools and same-origin server calls [web:20]
    if (allowedOrigins.includes(origin) || vercelPattern.test(origin)) {
        return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
}

// HTTP middleware
app.use(
    cors({
        origin: originChecker,
        credentials: true, // required so browsers send cookies/Authorization to cross-origin [web:20]
    })
);

app.use(express.json());
app.use(cookieParser()); // ensures req.cookies is populated for auth middleware [web:39]

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/connection", connectionRouter);

// Socket.IO with mirrored CORS config
export const io = new Server(server, {
    cors: {
        origin: originChecker, // mirror the same allowlist/regex for websockets [web:63][web:70]
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
    console.log(`Server start listening at port ${PORT}`);
});
