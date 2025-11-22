import express from "express"
import adminRoutes from "./router/adminRoutes.js";
import userRoutes from "./router/userRoutes.js";
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'
import { connectDB } from "./config/bd.js";
import nodemailer from 'nodemailer'
import cors from "cors"
import { transporter } from "./config/transporter.js";
import handleRefreshToken from "./services/refreshTokenServices.js";
import rateLimit from "express-rate-limit"
const app=express();
const PORT= 8082;
const limiter= rateLimit({
    max:1000,
    windowMs: 60*60*1000,
    message: "Too many request try again in one hour"
})
dotenv.config();
connectDB();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})) 
app.use(express.json());
app.use(cookieParser());
app.use("/api/user",limiter,userRoutes);
app.use("/api/admin", adminRoutes);

app.listen(process.env.PORT||8082, ()=>{
    console.log("server start at PORT 8082");

})