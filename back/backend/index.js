import express from 'express'
import mongoose from 'mongoose';
const app = express();
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/index.js';
import http from 'http'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const server = http.createServer(app);

// Middleware pour lire les cookies
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(cookieParser());

const PORT=3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));


app.use('/auth',authRoutes);

// initialiser socket server 

export const io = new Server(server,{
  cors:{origin :'http://localhost:4200',
    credentials: true}
});

// Store online users 

export const onlineUser = {} ;
io.on("connection",(socket)=>{
  /* const userId = socket.handshake.query.userId ; */
  const token = socket.handshake.headers.cookie?.split('auth_token=')[1];
  if (!token) return socket.disconnect();
  try{
  const payload=jwt.verify(token,process.env.JWT_SECRET);
  const userId=payload.id;
  console.log(" user connected ",userId);
  if(userId) onlineUser[userId] = socket.id;
  console.log( 'Users Online : ',onlineUser );

  io.emit("getOnlineUsers",Object.keys(onlineUser));
  socket.on('sendMessage',(msg)=>{
     console.log('new msg sender',msg);
  })
  socket.on("disconnect",()=>{
    delete onlineUser[userId];
    io.emit("getOnlineUsers",Object.keys(onlineUser))
  })
  } catch (err) {
    console.log('JWT invalide', err);
    socket.disconnect();
  }
  
})


server.listen(PORT,()=>{
    console.log(`Backend is listen in port ${PORT}`);
})