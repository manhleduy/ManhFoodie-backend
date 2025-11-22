import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();
const verifyJWT= (req, res, next)=>{
    const authHeader= req.headers['authorization']
    if(!authHeader) return res.status(401).json({
        message: "Unauthorized: missing token",
        status: 401
    });
    const token =authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ 
            message: "Unauthorized: Invalid token format",
            status: 401
         });
    }
    try{
    const decoded=jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
    )
    req.email= decoded.email;
    next();
    }catch(e){
        
        return res.status(403).json({
            message:"Forbidden",
            status: 403
        })
    }
}
export default verifyJWT