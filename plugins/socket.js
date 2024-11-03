// plugins/socket.js
import { io } from 'socket.io-client';

export default defineNuxtPlugin(() => {
  const socket = io('http://localhost:8000'); // Connect to the Socket.IO server

  return {
    provide: {
      socket,
    },
  };
});
