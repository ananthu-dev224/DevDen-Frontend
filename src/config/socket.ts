import { io } from 'socket.io-client';

const socket = io("https://devden-backend.ananthuks.online");

export default socket;