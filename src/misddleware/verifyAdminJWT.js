import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config();
const verifyAdminJWT= (req, res, next)=>{
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
    if(decoded.email!=="mle529189@gmail.com"){
        return res.status(401).json({
            message: "Unauthorized: You are not the admin",
            status: 401
        })
    }
    next();
    }catch(e){
        
        return res.status(403).json({
            message:"Forbidden",
            status: 403
        })
    }
}
export default verifyAdminJWT