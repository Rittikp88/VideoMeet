// import React, {createContext, useMemo, useContext} from "react";
// import { io } from "socket.io-client";

// const SocketContext = createContext(null);

// export const useSocket = () => {
//     const socket = useContext(SocketContext);
//     return socket
// ;}

// export const SocketProvider = (props) => {
//     const socket = useMemo(() => io.connect("https://video-meet-server-86uoc4juh-rittikp88.vercel.app/"),[{ secure: true, transports: [ "flashsocket","polling","websocket" ] }] );
//     return (
//     <SocketContext.Provider value ={socket}>
//         {props.children}
//     </SocketContext.Provider>
//     )
// }

// ClientSide.js (Updated)

import React, { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props) => {
  const socket = useMemo(() =>
    io("https://video-meet-server-86uoc4juh-rittikp88.vercel.app", {
      secure: true,
      transports: ["websocket", "polling", "flashsocket"],
    })
  , []); // Pass an empty dependency array to useMemo to create the socket connection only once

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
