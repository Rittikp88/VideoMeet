import React, { useState, useCallback, useEffect} from "react";
import {useNavigate} from 'react-router-dom';
import {useSocket} from '../context/SocketProvider';
import viteLogo from '/vite.svg'
import '../assets/Looby.css'

function Looby() {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate()
  const handleSubmitForm = useCallback((e) => {
    e.preventDefault();
    socket.emit("room:join", {email, room});
  },[email, room, socket]); 

  const handleJoinRoom = useCallback((data) => {
    const {email, room} = data;
    navigate(`/room/${room}`);
    console.log(email,room)

  },[])

  useEffect(() => {
    console.log("djgchjdfhgs")
    socket.on("room:join", handleJoinRoom)
  },[socket])
  return (
 
    <div className="logo-first">
    
        <a href="">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        
      <h1 className="video-call-heading">Video Call</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">your Name</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="room">Room No.</label>
        <input type="text" id="room" value={room} onChange={(e) => setRoom(e.target.value)}/>
        <button>Join</button>
      </form>
    </div>
  );
}

export default Looby;
