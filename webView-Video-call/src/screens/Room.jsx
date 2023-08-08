import React, { useEffect, useCallback, useState, useRef } from "react";
import { useSocket } from "../context/SocketProvider";
import peer from "../service/peer";
import Loadindg from "./Loadindg";
import CallUser from "./CallUser";
import { IoCameraReverse, IoVolumeMuteSharp } from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";
import { BsCameraVideoOff } from "react-icons/bs";
import "../assets/Room.css";
const availableViews = {
  callJoiningForm: "callJoiningForm",
  mediaRoom: "mediaRoom",
};
const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localMicOn, setlocalMicOn] = useState(true);
  const [localVideoOn, setVideoOn] = useState(true);
  const [currentView, setCurrentView] = useState(
    availableViews.callJoiningForm
  );

  const localVideoref = useRef({});
  const remoteVideoref = useRef({});
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const callback = async (stream) => {
    setCurrentView(availableViews.mediaRoom); 
    setTimeout(() =>{
      localVideoref.current.srcObject = stream; // Set srcObject instead of src
      console.log(localVideoref.current.srcObject);
      for (const track of localVideoref.current.srcObject.getTracks()) {
        peer.peer.addTrack(track, localVideoref.current.srcObject);
      }
      setMyStream(stream);
      console.log({myStream});
      initWebRTC();

    },1000)   
      
  };

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
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
    let isSubscribed = true;
    console.log("video");
    const listenToTrack = async (ev) => {
      const remoteStream = ev.streams[0];
      console.log("got track");
      console.log(remoteStream);
      setRemoteStream(remoteStream);
      remoteVideoref.current.srcObject = remoteStream;
    };
    peer.peer.addEventListener("track", listenToTrack);

    return () => {
      // Clean up by removing the event listener when the component unmounts
      isSubscribed = false;
      peer.peer.removeEventListener("track", listenToTrack);
    };

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

  const initWebRTC = async () => {
    // ... Rest of the code remains the same
    console.log("kjbfjgfjhr")

    // Add an interval to capture frames every 100 milliseconds
    setInterval(() => {
      captureLocalFrames();
    }, 10000);
  };


  const captureLocalFrames = () => {
    const canvas = document.createElement('canvas');
    canvas.width = localVideoref.current.videoWidth;
    canvas.height = localVideoref.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(localVideoref.current, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/png');
    console.log(dataURL)
    // const newImageSrc = dataURL;
    // this.setState({ imageSrc: newImageSrc });
    // this.socket.emit('image',dataURL)

    // this.setState({ lastCapturedFrame: dataURL }); // Update the last captured frame in the state
  };

  function toggleMic() {
    localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
    localVideoref.current.srcObject.getAudioTracks().forEach((track) => {
      localMicOn ? (track.enabled = false) : (track.enabled = true);
    });
    console.log("ahgdvjhdcvhjsg");
  }

  function videoOff() {
    localVideoOn ? setVideoOn(false) : setVideoOn(true);
    localVideoref.current.srcObject.getVideoTracks().forEach((track) => {
      localVideoOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function callEnd() {
    console.log("jvdfhjgvfheg")
    peer.peer.close();
    setMyStream(null);
    setRemoteStream(null);
    setRemoteSocketId(null);
    setCurrentView(availableViews.callJoiningForm);

  }

  const viewMap = {
    [availableViews.callJoiningForm]: (
      <h4>
        {remoteSocketId ? (
          <CallUser onClick={callback} remoteSocketId={remoteSocketId} />
        ) : (
          <Loadindg />
        )}
      </h4>
    ),
    [availableViews.mediaRoom]: (
      <>
        <div>
          <div className="video-container ">
            <div className="remote-video-container left">
              <video
                className="remote-video"
                ref={(ref) => {
                  if (remoteStream && ref) {
                    ref.srcObject = remoteStream;
                  }
                }}
                autoPlay
              ></video>
            </div>
            <div className="separator"></div>
            <div className="remote-video-container right">
              <video
                className="local-video"
                ref={localVideoref}
                autoPlay
              ></video>
            </div>
          </div>
          <div className="call-controls">
            <button className="control-btn" onClick={() => toggleMic()}>
              <IoVolumeMuteSharp size={27} />
            </button>
            <button className="control-btn">
              <IoCameraReverse size={27} />
            </button>
            <button className="control-btn" onClick={() => videoOff()}>
              <BsCameraVideoOff size={27} />
            </button>
            <button className="control-btn" onClick ={() => callEnd()}>
              <MdCallEnd size={27} />
            </button>
          </div>
        </div>
      </>
    ),
  };

  return <>{viewMap[currentView]}</>;
};

export default RoomPage;
