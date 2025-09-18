import dotenv from 'dotenv'
dotenv.config()

import Express  from "express";
import config from "./config";
import cors from 'cors'
import mongoose from "mongoose";
import http from 'http'
import {Server as SocketIoServer} from 'socket.io'


import mediasoupHandler from './socket/mediasoupHandler'
import companyAuth_route from "./routes/company/auth";
import company_route from './routes/company/company';

const app=Express()


const server=http.createServer(app);
const io=new SocketIoServer(server,{
    cors:{
        origin:'http://localhost:5173',
        credentials:true
    }
})

app.use(Express.json())

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
mongoose 
        .connect(config.mongoURL)
        .then(()=>console.log('mongodb connected'))
        .catch((err) => console.error("mongoose error", err))


        
app.use('/company/auth',companyAuth_route)


app.use('/company',company_route)

io.on('connection',(socket)=>{    
    console.log('user connected',socket.id);
    mediasoupHandler(io,socket)
})


server.listen(config.port,()=>{
    console.log('server is running');
    console.log('http://localhost:3000');  
})