// src/utils/socket.js
import { io } from "socket.io-client";

let socket;

export const getSocket = (serverUrl) => {
    if (!socket) {
        socket = io(serverUrl, { autoConnect: true });
    }
    return socket;
};
