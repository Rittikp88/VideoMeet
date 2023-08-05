import React, {useCallback, useState} from "react";
import "../assets/CallUser.css";
import { FcVideoCall } from "react-icons/fc";
import { useSocket } from "../context/SocketProvider";
import peer from '../service/peer';

function CallUser(props) {
  const socket = useSocket();
  const remoteSocketId = props.remoteSocketId;

  const handleCallUser = useCallback(async() => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            // audio: true,
            video: true,
        })
        const offer = await peer.getoffer();
        socket.emit("user:call", { to: remoteSocketId, offer });
        // localVideoref.current.srcObject = stream; // Set srcObject instead of src
        props.onClick(stream);
        
    } catch (error) {
        console.error("Error accessing media devices:", error);
    }
},[remoteSocketId, socket])


  return (
    <div className="OuterDiv">
      <h1>CALL</h1>
      <h1>Rittik Prasad</h1>

      <section className="call-buton">       
        <button className="cc-calto-action-ripple" onClick={handleCallUser}>
        <FcVideoCall className="icon"/>
        </button>
      </section>
    </div>
  );
}

export default CallUser;
