import { sequelizeInstance } from "../config/bd.js";
import { QueryTypes } from "sequelize";

export const handleOrderCount= async(email)=>{
    try{
        const orderNum= await sequelizeInstance
        .query("SELECT COUNT(*) AS ordernum, SUM(amount) AS foodamount FROM orders WHERE email= ?",{
            replacements: [email],
            type: sequelizeInstance.QueryTypes.SELECT
        })
        const {ordernum, foodamount}= orderNum[0];
        
        return {
            orderNum: ordernum,
            foodamount: foodamount
        }
    }catch{
        return {
            status: 500,
             message: "server error"
        }
    }
}
export const handleExpense= async(email)=>{
    try{
        const table= await sequelizeInstance
        .query(`
            SELECT 
              EXTRACT(MONTH FROM "createdat") AS month,
              SUM(price*amount) AS expense
            FROM orders
            WHERE email=?
            GROUP BY email, EXTRACT(MONTH FROM "createdat") ;
            `,{
            replacements: [email],
            type: sequelizeInstance.QueryTypes.SELECT
        })
        return table;
    }catch(e){
        console.log(e);
        return {
        
            message:" server error, try again",
            status: 500
        }
    }
}
export const handleCategoryDistribution= async(email)=>{
    try{
        const pieData= await sequelizeInstance
        .query(
            `SELECT detail AS name, COUNT(*) AS value
            FROM orders 
            WHERE email=?
            GROUP BY detail;
            `
        ,{
            replacements:[email],
            type: sequelizeInstance.QueryTypes.SELECT
        })
        return pieData;
    }catch(e){
        console.log(e);
        return{
            message: "server error, try again later",
            status: 500
        }
    }
}

export const handleOrder= async(orderInfo)=>{
    try{
    const {
      email,
      name,
      phonenumber,
      address,
      food,
      price,
      fastorder,
      detail,
      amount
    } = orderInfo
    const createdat = new Date();
    const updatedat = new Date();
    if (!email ) {
      return{
        message: "missing required field",
        status: 400
      }
    }
    const safeName = name ?? '';
    const safePhoneNumber = phonenumber ?? 0;
    const safeAddress = address ?? '';
    const safeFood = food ?? null;
    const safefastorder = fastorder ?? '';
    const safePrice = price ?? 0;
    const safeAmount = amount ?? '';
    const safeDetail = detail ?? '';
    await sequelizeInstance.query(
      "INSERT INTO orders (email,name,phonenumber,address,food,price,fastorder,detail,amount, createdat, updatedat) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      {
        replacements: [email,safeName,safePhoneNumber,safeAddress,safeFood,safePrice,safefastorder,safeDetail,safeAmount,createdat,updatedat],
        type: sequelizeInstance.QueryTypes.INSERT
      }
    );

    return{
      message: "orders successfully",
      status: 201
    };
  }catch(e){
    console.log(e);
    return{
      message:" server error",
      status: 500
    }
  }
}

export const handleGetOrders= async(email)=>{
    try{
      const orders= await sequelizeInstance.query("SELECT id, name, phonenumber, address, food, price, fastorder, detail, amount FROM orders WHERE email=?",
        {
          replacements:[email],
          type: sequelizeInstance.QueryTypes.SELECT
        }
      );
      if(orders.length==0) return{
        message:" order something first",
        status: 404
      }
      return {
        message:" successful",
        orders: orders,
        status: 200
      }
    }catch{
        return{
            message: "server error",
            status: 500
        }
    }
}
