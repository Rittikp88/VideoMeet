import React, {createContext, useMemo, useContext} from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket
;}

export const SocketProvider = (props) => {
    const host = '44.207.3.207';
    const port = 8080;
    // const socket = useMemo(() => io.connect("https://d670-2405-201-4018-93be-e021-854f-8df0-3410.ngrok-free.app"),[]);
    const socket = useMemo(() => io.connect(`http://${host}:${port}`));
    return (
    <SocketContext.Provider value ={socket}>
        {props.children}
    </SocketContext.Provider>
    )
}