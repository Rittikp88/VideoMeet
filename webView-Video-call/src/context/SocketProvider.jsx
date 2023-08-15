import React, {createContext, useMemo, useContext} from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    console.log(socket)
    return socket
;}

export const SocketProvider = (props) => {
    // const host = 'localhost';
    // const port = 8080;
    const socket = useMemo(() => io.connect("https://prasadrittik.online"),[]);
    // const socket = useMemo(() => io.connect(`http://${host}:${port}`));
    // const socket = useMemo(() => io.connect('44.207.3.207:8080'));
    return (
    <SocketContext.Provider value ={socket}>
        {props.children}
    </SocketContext.Provider>
    )
}