import { io } from "socket.io-client";
import { User } from "../stores/user-store";


export const createSocket = (user: User) => {
    return io( "",{
        path: "/ws",
        autoConnect: false,
        transports: ["websocket"],
        query: {
            accessToken: user.accessToken,
        },
    });
}