import React, { useEffect, useCallback, useState, useRef } from "react";
import { useSocket } from "../context/SocketProvider";
import peer from "../service/peer";
import Loadindg from "./Loadindg";
import CallUser from "./CallUser";
import {IoCameraReverse, IoVolumeMuteSharp } from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";
import { BsCameraVideoOff } from "react-icons/bs";
import '../assets/Room.css';

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [disabled, setDisabled] = useState(true);

  const localVideoref = useRef(null);
  const remoteVideoref = useRef(null);
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);
  

  const callback = async (stream) => {
    setDisabled(!disabled);
    setTimeout(()=>{
      localVideoref.current.srcObject = stream; // Set srcObject instead of src
      console.log(localVideoref.current.srcObject);
    for (const track of localVideoref.current.srcObject.getTracks()) {
      peer.peer.addTrack(track, localVideoref.current.srcObject);
    }
    setMyStream(stream);

    },1000);
    
    console.log(myStream);
  };

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      // try {
      //   const stream = await navigator.mediaDevices.getUserMedia({
      //     // audio: true,
      //     video: true,
      //   });
      //   handlefunction(stream);

      //   localVideoref.current.srcObject = stream; // Set srcObject instead of src
      // } catch (error) {
      //   console.error("Error accessing media devices:", error);
      // }
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );
  const handleCallAccepted = useCallback(({ from, ans }) => {
    peer.setLocalDescription(ans);
    console.log("CAll Accepted");

  }, []);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getoffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      console.log(ans);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    console.log("hevghe", ans);
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    
      peer.peer.addEventListener("track", async (ev) => {
        const remoteStream = ev.streams[0];
        console.log("got track");
        setTimeout(() => {

        setRemoteStream(remoteStream);
        remoteVideoref.current.srcObject = remoteStream; // Set srcObject instead of src
      },10000);
      });

    
    
  }, []);
  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);
  return (
    <>
      {disabled ? (
        <h4>
          {remoteSocketId ? (
            <CallUser onClick={callback} remoteSocketId={remoteSocketId} />
          ) : (
            <Loadindg />
          )}
        </h4>
      ) : (
        <div>

        <div className="video-container ">
        <div className="remote-video-container left">
          {remoteVideoref && (
            <video
              className="remote-video"
              ref={remoteVideoref}
              autoPlay
            ></video>
          )}
        </div>
        <div className="separator"></div>
        <div className="remote-video-container right">
          {localVideoref && (
            <video
              className="local-video"
              ref={localVideoref}
              autoPlay
            ></video>
          )}
        </div>
      </div>
      <div className="call-controls">
          <button className="control-btn">
          <IoVolumeMuteSharp size={27} />
          </button>
          <button className="control-btn">
          <IoCameraReverse size={27}/>
          </button>
          <button className="control-btn">
          <BsCameraVideoOff size={27}/>
          </button>
          <button className="control-btn">
          <MdCallEnd size={27}/>
          </button>
        </div>
        </div>

      )}

      
    </>
  );
};

export default RoomPage;
