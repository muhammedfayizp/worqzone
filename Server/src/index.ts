import dotenv from 'dotenv'
dotenv.config()

import Express  from "express";
import config from "./config";
import cors from 'cors'
import companyAuth_route from "./routes/company/auth";
import mongoose from "mongoose";

const app=Express()
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


app.listen(config.port,()=>{
    console.log('server is running');
    console.log('http://localhost:3000');  
})