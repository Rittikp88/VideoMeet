import React, {createContext, useMemo, useContext} from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket
;}

export const SocketProvider = (props) => {
    const socket = useMemo(() => io.connect("https://a988-103-44-52-191.ngrok-free.app"),[]);
    return (
    <SocketContext.Provider value ={socket}>
        {props.children}
    </SocketContext.Provider>
    )
}