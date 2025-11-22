import { sequelizeInstance } from "../config/bd.js";
import { QueryTypes } from "sequelize";
import { handleGetUser, handleRegister,HandleUpdateUserInfo,handleUserLogin } from "../controller/userController.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { handleFood, handleSelectedFood } from "../controller/foodController.js";
import { handleCategoryDistribution, handleExpense, handleGetOrders, handleOrder, handleOrderCount } from "../controller/orderController.js";
import { resetOTP, sendOTPEmail, verifyOTP, sendUserEmail } from "../controller/sendEmailController.js";
import { handleGetDisCounts } from "../controller/discountController.js";

dotenv.config();
export const handleSendOTP=async (req, res)=>{
  try{
  const {email}= req.body;
  if(!email) return res.status(400).json({
    message: "missing email ",
    status: 400
  })
  const data= await sendOTPEmail(email)
  res.status(200).json({
    message: "success",
    
    status: 200
  })
}catch(e){
  
  return res.status(500).json({
    message: "server error",
    status: 500
  })
}
}
export const handleSendUserEmail= async(req, res)=>{
  try{
    const {name, email, emailContent}= req.body;
    if(!email) return res.status(400).json({
      message: "missing email",
      status: 400
    })
    const data= await sendUserEmail(name,email, emailContent);
    res.status(200).json({
      message:"success",
      status: 200
    })
  }catch(e){
    return res.status(500).json({
      message:"server error",
      status: 500
    })
  }
}
export const handleVerifyOTP= async(req, res)=>{
  try{
    const {OTP,email}= req.body;
    
    if(!OTP) return res.status(400).json({
      message: "type in your OTP first",
      status: 400
    })
    const accessToken =jwt.sign(
      {"email":email},
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: "60s"}
    );
    const data= await verifyOTP(OTP,accessToken);
    res.status(200).json(data)
  }catch(e){
    console.log(e)
    return res.status(500).json({
      message: "server error",
      status: 500
    })

  }
}
export const handleResetOTP= async(req,res)=>{
  try{
    resetOTP();
    res.status(201).json({
      message: "OTP has reseted",
      status: 200
    })
  }catch(e){
    res.status(500).json({
      message: "server error",
      status: 500
    })
  }
}

export const HandleSignIn= async( req, res)=>{
  try{
    const {email, password}= req.body;
    if(!email || !password) return res.status(404).json({
      message:"missing email or password",
      status:404
    });
    const accessToken =jwt.sign(
      {"email":email},
      process.env.ACCESS_TOKEN_SECRET,
      {expiresIn: "60s"}
    );
    const refreshToken =jwt.sign(
      {"email":email},
      process.env.REFRESH_TOKEN_SECRET,
      {expiresIn: "24h"}
    );
    const userData= await handleUserLogin(email,password, accessToken, refreshToken);
    if(userData.status===200) res.cookie('refreshToken', refreshToken, 
    {
      httpOnly: true, 
      maxAge: 24*60*60*1000
    })
    return res.status(200).json(userData);
  }catch(e){
    console.log(e);
    return res.status(500).json({
      message:"server error",
      status:500
    })
  }
}
export const HandleSignUp = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phonenumber,
      password,
      roleid,
      address,
      
    } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        message: "Missing required user fields",
        status: 400
      });
    }
    const response= await handleRegister(req.body);
    
    res.status(201).json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Server error",
      status: 500,
    });
  }
};
export const HandleSignOut= async (req, res)=>{
  try{
    const cookies= req.cookies;
    if(!cookies?.refreshToken) return res.sendStatus(204);
    res.clearCookie('refreshToken', {httpOnly: true});
    return res.status(200).json({
      message:"logged out successfully",
      status: 204
    })
  }catch(e){
    return res.status(500).json({
      message: "server error",
      status: 500
    })
  }
}
export const UpdateUserInfo= async(req,res)=>{
  try{
    const {email}= req.body;
    
    if(!email) return res.status(400).json({
      message: "missing required information",
      status: 400
    })
    
    const data= await HandleUpdateUserInfo(req.body)
    res.status(202).json(data)
  }catch(e){
    console.log(e);
    res.status(500).json({
      message: "server error",
      status: 500
    })
  }
}
export const GetUser =async(req, res)=>{
  try{
    const {email}= req.body;
    console.log(email)
    if(!email)return res.status(401).json({
      status: 401,
      message: "missing email!"
    })
    const userData= await handleGetUser(email);
    res.status(200).json(userData)
  }catch(e){
    console.log(e)
    return res.status(500).json({
      message: "server error",
      status: 500
    })
  }
}

export const CountOrderNum= async(req, res)=>{

  try{
    const {email}= req.body;
    
    if(!email)return res.status(401).json({
            status: 401,
            message: "missing email!"
        })
    const orderCount=await handleOrderCount(email);
    const {orderNum,foodamount}= orderCount
    console.log(orderCount);
    res.status(200).json({
      status: 200,
      orderNum: orderNum,
      foodamount: foodamount,
      message: "successful"
    })
  }catch(e){
    console.log(e)
    res.status(500).json({
      status: 500,
      message: "Server error, try later"
    })
  }
}
export const ExpenseTable=  async(req, res)=>{
  try{
    const {email}=req.body;
    if(!email)return res.status(401).json({
            status: 401,
            message: "missing email!"
        })
    const ExpenseTable=await handleExpense(email);
    res.status(200).json({
      status: 200,
      ExpenseTable: ExpenseTable,
      message: " successful"
    })
  }catch(e){
    res.status(500).json({
      status: 500,
      message: "Server error, try later"
    })
  }
}
export const CategoryDistributeTable= async(req, res)=>{
  try{
    const {email}=req.body;
    if(!email)return res.status(401).json({
            status: 401,
            message: "missing email!"
        })
    const CategoryDistributeTable=await handleCategoryDistribution(email);
        
    res.status(200).json({
      status: 200,
      CategoryDistributeTable: CategoryDistributeTable,
      message: " successful"
    })
  }catch(e){
    res.status(500).json({
      status: 500,
      message: "Server error, try later"
    })
  }
}
export const getUserOrders= async(req,res)=>{
  try{
     const email= req.params.email;
      if(!email) return res.status(404).json({
            message:"missing email ",
            status: 404
      })
      const orders= await handleGetOrders(email);
      res.status(200).json(orders);
  }catch(e){
    console.log(e)
    res.status(500).json({
      message:"Server error",
      status:500
    })
  }
}
export const getOrderByIdFromUser=async (req,res)=>{
    try{
        const id= req.params.id;
        const userid= req.params.userid
        if(!id) return res.status(404).json({
            message:"error",
            status: 404
        })
        const order = await sequelizeInstance.query("SELECT name, phonenumber, address, food, price, fastorder, detail, amount FROM `orders` WHERE id=? && userid=?",
        {
            replacements: [id,userid],
            type: sequelizeInstance.QueryTypes.SELECT
        })
        if(!order) return res.status(404).json({
            message:"error",
            status: 404
        })
        res.status(200).json(order);
    }catch(e){
        res.status(500).json({
            message:" server error",
            status: 500
        })
    }
}
export const Order= async(req, res)=>{
  try{
    
    const orderInfo= req.body
    
    if (!orderInfo) {
      return res.status(400).json({
        message: "Missing required user fields",
        status: 400
      });
    }
    const response= handleOrder(orderInfo);

    res.status(201).json(response);
  }catch(e){
    console.log(e);
    res.status(500).json({
      message:" server error",
      status: 500
    })
  }
}
export const updateOrderFromUser= async(req, res)=>{
  try{
    const id=req.params.id;
    if(!id) res.status(404).json({
      message:" orders not available",
      status: 404
    })
    const {
      userid,
      name,
      phonenumber,
      address,
      food,
      price,
      fastorder,
      detail,
      amount
    } = req.body;
    const updatedat = new Date();
    if (!name || !phonenumber|| !address ) {
      return res.status(400).json({
        message: "Missing required user fields",
        status: 400
      });
    }
    const safeuserid= userid ?? 0;
    const safeName = name ?? '';
    const safePhoneNumber = phonenumber ?? 0;
    const safeAddress = address ?? '';
    const safeFood = food ?? null;
    const safefastorder = fastorder ?? '';
    const safePrice = price ?? 0;
    const safeAmount = amount ?? '';
    const safeDetail = detail ?? '';
    await sequelizeInstance.query(
      "UPDATE `orders` SET userid=?, address=?,food=?,price=?,fastorder=?,detail=?,amount=?, updatedat=? WHERE id=? ",
      {
        replacements: [safeuserid,safeName,safePhoneNumber,safeAddress,safeFood,safefastorder,safePrice,safeAmount,safeDetail,updatedat,id],
        type: sequelizeInstance.QueryTypes.UPDATE
      }
    );

    res.status(202).json({
      message: "update orders successfully",
      status: 202
    });
  }catch(e){
    console.log(e);
    res.status(500).json({
      message:" server error",
      status: 500
    })
  }
}
export const deleteOrderFromUser= async (req,res)=>{
    try{
    const id=req.params.id;
    if(!id)return res.status(404).json({
      message:"can delete now try again",
      status: 404
    })
    await sequelizeInstance.query("DELETE FROM `orders` WHERE id=?",{
      replacements:[id],
      type: sequelizeInstance.QueryTypes.DELETE
    })
    res.status(200).json({
      message:" delete compelte",
      status:200
    })
  }catch(e){
  
    res.status(500).json({
      message:"server error",
      status:500
    })
  }
}

export const getAllFoodsFromUser= async(req, res)=>{
  try{
      const response=await handleFood();
      res.status(200).json(response);
  }catch{
    res.status(500).json({
      message:"Server error",
      status:500
    })
  }
}

export const getFoodByIdFromUser=async (req,res)=>{
    try{
        const id= req.params.id;
        if(!id) return res.status(404).json({
            message:"error",
            status: 404
        })
        const dish=handleSelectedFood(id);
        res.status(200).json(dish);
    }catch(e){
        res.status(500).json({
            message:" server error",
            status: 500
        })
        
    }
}

export const getDiscounts= async ( req,res)=>{
  try{
      const response=await handleGetDisCounts();
      res.status(200).json(response);
  }catch{
    res.status(500).json({
      message:"Server error",
      status:500
    })
  }
}
export const getDiscount= async(req,res)=>{
  try{
    const id = req.params.id;
    if(!id) res.status(404).json({
      message:id,
      status:404
    });

    const [user] = await sequelizeInstance.query(
      'SELECT * FROM `discounts` WHERE id = ?',
    {
    replacements: [id],
    type: sequelizeInstance.QueryTypes.SELECT
    }
  );
  if(!user)res.status(404).json({
    message:"user not found",
    status:404
  });
  res.status(200).json(user);
  }catch(e){
    res.status(500).send({
      message:" server error",
      status:500
    })
  }
}

