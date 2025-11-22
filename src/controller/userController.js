import { sequelizeInstance } from "../config/bd.js"
import bcrypt from "bcryptjs"
export const handleUserLogin=async (email, password, accessToken, refreshToken)=>{
    try{
        if(!email || !password) return {
            message:"missing email or password",
            status:400
        };
        const [userPassword]= await sequelizeInstance
        .query("SELECT password FROM users WHERE email= ?",{
            replacements: [email],
            type: sequelizeInstance.QueryTypes.SELECT
        })
        const [res]= await sequelizeInstance
        .query("SELECT lastname, firstname, email, roleid FROM users WHERE email= ?",{
            replacements: [email],
            type: sequelizeInstance.QueryTypes.SELECT
        })
        const user= {lastname: res.lastname, 
          firstname: res.firstname,
          email: res.email
        }
        if(res){
            const check= await bcrypt.compareSync(password, userPassword.password);
            if(check){
                
                return {
                    accessToken: accessToken,
                    user:user,
                    roleid: res.roleid,
                    message: "login succesfully",
                    status: 200}
            }else{
                return {
                    message:"wrong password",
                    status:400}
            }
        }else{
            return{
                message:"can not find this user",
                status: 404}
        }
    }catch(e){
        console.log(e);
        return {
            message:"serverError",
            status:500}
    }
}
export const handleRegister= async (userInfo)=>{
      try {
        const {firstname,lastname,email,phonenumber,password,roleid,address} = userInfo;
        
        if(!email || !password) return {
            message:"missing email or password",
            status:400
        };
        if(checkEmail(email)==true) return {
            message: "user with email is already exist",
            status: 400
        }
        const createdat = new Date();
        const updatedat = new Date();
    
        const salt = await bcrypt.genSalt(10);
        const safePassword = await bcrypt.hash(password, salt);
    
        const safefirstname = firstname ?? '';
        const safelastname = lastname ?? '';
        const safePhone = phonenumber ?? '';
        const saferoleid = roleid ?? null;
        const safeAddress = address ?? '';
      
        await sequelizeInstance.query(
          "INSERT INTO users (firstname, lastname, email, phonenumber, password, roleid, address, createdat, updatedat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          {
            replacements: [safefirstname,safelastname,email,safePhone,safePassword,saferoleid,safeAddress,createdat,updatedat],
            type: sequelizeInstance.QueryTypes.INSERT
          }
        );
        return {
          message: "User created successfully",
          status: 201
        };
      } catch (e) {
        
        return{
            message: "user with email is already exist",
            status: 500
        }
}
}
export const handleGetUser= async( email)=>{
    try{
    const [user]= await sequelizeInstance
        .query("SELECT * FROM users WHERE email= ?",{
            replacements: [email],
            type: sequelizeInstance.QueryTypes.SELECT
        })
    if(!user) return{
        message: "this email haven't registed yet",
        status: 404
    }
        return{
            message: "successful",
            status: 200,
            userData: user
        }
    }
    catch{
        return{
            message: "server error",
            status: 500
        }
    }
}
export const HandleUpdateUserInfo= async(userInfo)=>{
    try{
    const {
      firstname,
      lastname,
      email,
      phonenumber,
      password,
      roleid,
      address
    } = userInfo;
    const updatedat = new Date();
    if(!email) return {
      message: "missing email",
      status:404,
    }
    
    
   
    const safefirstname = firstname ?? '';
    const safelastname = lastname ?? '';
    const safePhone = phonenumber ?? '';
    const saferoleid = roleid ?? 0;
    const safeAddress = address ?? '';
    if(password){
      const salt = await bcrypt.genSalt(10);
      const safePassword = await bcrypt.hash(password, salt);
      await sequelizeInstance.query(
        "UPDATE users SET firstname= ?, lastname=?, email=?, phonenumber=?, password=?, roleid=?, address=?, updatedat=? WHERE email=?",
        {
          replacements: [
            safefirstname,
            safelastname,
            email,
            safePhone,
            safePassword,
            saferoleid,
            safeAddress,
            updatedat,
            email
          ],
          type: sequelizeInstance.QueryTypes.UPDATE
        }
      );  
    }else{
      await sequelizeInstance.query(
        "UPDATE `Users` SET firstname= ?, lastname=?, email=?, phonenumber=?, roleid=?, address=?, updatedat=? WHERE email=?",
        {
          replacements: [
            safefirstname,
            safelastname,
            email,
            safePhone,
            saferoleid,
            safeAddress,
            updatedat,
            email
          ],
          type: sequelizeInstance.QueryTypes.UPDATE
        }
      );  
    }

    return{
      message: "User updated successfully",
      status: 202
    };
  }catch(e){
    return{
      message:"server error",
      status:500
    }
  }
}

export const checkEmail = async(email)=>{
    try{
    const [user]= await sequelizeInstance
        .query("SELECT email FROM users WHERE email= ?",{
            replacements: [email],
            type: sequelizeInstance.QueryTypes.SELECT
        })
    if(user){
        return true;
    }
        return false;
    }
    catch{
        return true;
    }
    
}