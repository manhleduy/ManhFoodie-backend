
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
const handleRefreshToken=async (req, res)=>{
    const refreshToken= req.cookies.refreshToken;
    if(!refreshToken) return res.status(401).json({
        message:"Unauthorized: Refresh token is missing",
        status: 401
    })
    try{
    const decoded= jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    const {email}= decoded;
    const accessToken =jwt.sign(
        {"email":email},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "60s"}
    );
    
    return res.status(200).json({
        accessToken: accessToken,
        status: 200,
        message: "successful"
    });
    } catch(e){
        res.clearCookie('refreshToken', { 
            httpOnly: true, 
            sameSite: 'strict' 
        });

        return res.status(403).json({
            message:"Forbidden: Invalid or expired refresh token",
            status:403
        })
    }
}
export default handleRefreshToken