import React from 'react'
import {io} from "socket.io-client"


const socket = io("https://farmdrive.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});
export default socket;