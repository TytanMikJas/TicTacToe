import { io } from "socket.io-client";

export const socket = io( "http://localhost:5000",{
    path: "/ws",
    autoConnect: false,
    transports: ["websocket"],
});

export const createSocket = (userId: string) => {
    socket.auth = { userId };
    return socket;
}