import React , {createContext, useMemo, useContext} from "react";
import { io } from "socket.io-client";

const FramesSocket = createContext(null);

export const useFrameSocket = () => {
    const socket_client = useContext(FramesSocket);
    console.log(socket_client);
    return socket_client
}

export const FramesSocketProvider = (props) => {
    const host_ip = '44.207.3.207'; // paste your server ip address here
    const port = 9999;
    const socket_client = useMemo(() => io.connect(`http://${host_ip}:${port}`));
    // const socket_client = useMemo(() => io.connect(`${host_ip}:${port}`));
    return (
        <FramesSocket.Provider value = {socket_client}>
            {props.children}
        </FramesSocket.Provider>
    )
}