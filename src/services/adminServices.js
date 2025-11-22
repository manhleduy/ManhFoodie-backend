import { sequelizeInstance } from "../config/bd.js";
import { QueryTypes } from "sequelize";
import { handleFood } from "../controller/foodController.js";

export const getAllUser= async(req, res)=>{
  try{
    const users = await sequelizeInstance.query('SELECT lastname, firstname, email, phonenumber, address  FROM users', {
      type: QueryTypes.SELECT,
    });
    if(users.length==0) return res.status(404).json({
      message:" there is no user in here",
      status:404
    })
    res.status(200).json({
      message: "get all user ",
      users: users,
      status: 200
    });
  }catch(e){
    res.status(500).json({
      message: "server error",
      status:500
    })
  }
}
export const getUserStatistic= async (req,res)=>{
  try{
  //totalUser
    const sumData= await sequelizeInstance
      .query(`SELECT COUNT(*) AS userNum FROM users`,{
          type: sequelizeInstance.QueryTypes.SELECT
      })
    const {usernum}= sumData[0];

  //monthly register
    const monthlyRegister= await sequelizeInstance
      .query(
        `
          SELECT 
          EXTRACT(MONTH FROM "createdat") AS month, 
          COUNT(*) AS registerNum
          FROM users
          GROUP BY EXTRACT(MONTH FROM "createdat")
          ORDER BY EXTRACT(MONTH FROM "createdat");
        `,
      {type: sequelizeInstance.QueryTypes.SELECT}
      )
    res.status(200).json({
      message:" successful",
      userNum: usernum,
      monthlyRegister: monthlyRegister,
      status: 200
    })
  }catch(e){
    
    res.status(500).json({
      message: "server error",
      status: 500
    })
  }
}

export const getAllFoods= async(req, res)=>{
 try{
      const response=await handleFood();
      const {foods}= response
      res.status(200).json({
        message: "successful",
        foods: foods[0],
        status: 200
      }
      );
   }catch(e){
    console.log(e);
     res.status(500).json({
       message:"Server error",
       status:500
     })
  }
}
export const createFood= async (req,res)=>{
  try{
    const {
      name,
      rating,
      origin,
      category,
      image, 
      price, 
      ingredient, 
      detail
    } = req.body;
    const createdat = new Date();
    const updatedat = new Date();
    if (!name || !origin || !category) {
      return res.status(400).json({
        message: "Missing required user fields",
        status: 400
      });
    }
    const safeName = name ?? '';
    const safeRating = rating ?? 0;
    const safeOrigin = origin ?? '';
    const safeCategory = category ?? null;
    const safeImage = image ?? '';
    const safePrice = price ?? 0;
    const safeIngredient = ingredient ?? '';
    const safeDetail = detail ?? '';
    await sequelizeInstance.query(
      "INSERT INTO food (name,rating,origin,category,image, price, ingredient, detail, createdat, updatedat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      {
        replacements: [
          safeName,
          safeRating,
          safeOrigin,
          safeCategory,
          safeImage,
          safePrice,
          safeIngredient,
          safeDetail,
          createdat,
          updatedat
        ],
        type: sequelizeInstance.QueryTypes.INSERT
      }
    );

    res.status(201).json({
      message: "User created successfully",
      status: 201
    });
  }catch(e){
    console.log(e);
    res.status(500).json({
      message:" server error",
      status: 500
    })
  }
}
export const updateFood= async (req,res)=>{
  try{
    const id= req.params.id;
    if(!id) return res.status(404).json({
      message: "dish not found",
      status: 404
    })
    const {name,rating,origin,category,image, price, ingredient, detail} = req.body;
    const updatedat = new Date();
    if (!name || !category || !origin) {
      console.log("ccc");
      return res.status(400).json({
        message: "Missing required user",
        status: 400
      });
    }
    const safeName = name ?? '';
    const safeRating = rating ?? 0;
    const safeOrigin = origin ?? '';
    const safeCategory = category ?? null;
    const safeImage = image ?? '';
    const safePrice = price ?? 0;
    const safeIngredient = ingredient ?? '';
    const safeDetail = detail ?? '';
    await sequelizeInstance.query(
      "UPDATE food SET name= ?,rating= ?,origin= ?,category= ?,image= ?, price= ?, ingredient= ?, detail= ?, updatedat= ? WHERE id= ?",
      {
        replacements: [
          safeName,
          safeRating,
          safeOrigin,
          safeCategory,
          safeImage,
          safePrice,
          safeIngredient,
          safeDetail,
          updatedat,
          id
        ],
        type: sequelizeInstance.QueryTypes.UPDATE
      }
    );
  res.status(202).json({
    message: "dish updated successfully",
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
export const deleteFood= async (req,res)=>{
    try{
    const id=req.params.id;
    if(!id)return res.status(404).json({
      message:"can delete now try again",
      status: 404
    })
    await sequelizeInstance.query("DELETE FROM food WHERE id=?",{
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

export const getAllOrders= async(req,res)=>{
  try{
      const [orders]= await sequelizeInstance.query("SELECT name,email, phonenumber, address, food, price, detail, amount FROM orders ");
      if(orders.length==0) return res.status(404).json({
        message:"no orders recently",
        status: 404
      });
      res.status(200).json({
        message: "successful",
        orders: orders,
        status: 200
      });
  }catch{
    res.status(500).json({
      message:"Server error",
      status:500
    })
  }
}
export const getOrderStatistic= async(req, res)=>{
  try{
      // total of order, total income, total food ordered
      const sumData= await sequelizeInstance
      .query(`SELECT 
              COUNT(*) AS orderNum, 
              SUM(amount) AS foodOrderedAmount, 
              SUM(amount*price) AS totalIncome
              FROM orders`,{
          type: sequelizeInstance.QueryTypes.SELECT
      })
      const {orderNum, foodOrderedAmount, totalIncome}= sumData[0];
      // monthly expense 
      const monthlyIncome= await sequelizeInstance
        .query(`
            SELECT 
            EXTRACT(MONTH FROM "createdat") AS month, 
            SUM(price*amount) AS expense
            FROM orders
            GROUP BY EXTRACT(MONTH FROM "createdat")
            ORDER BY EXTRACT(MONTH FROM "createdat");
            `,{
            type: sequelizeInstance.QueryTypes.SELECT
        })
        // category and origin distribution 
        const categoryDistribute= await sequelizeInstance
        .query(
            `SELECT detail AS name, COUNT(*) AS value
            FROM orders 
            GROUP BY detail;
            `
        ,{type: sequelizeInstance.QueryTypes.SELECT})

        const originDistribute= await sequelizeInstance
        .query(
            `
            SELECT origin AS name, COUNT(origin) AS value
            FROM
            (
              SELECT 
              f.origin AS origin
              FROM orders o
              INNER JOIN food f
              ON o.food= f.name
            ) AS a
            GROUP BY origin;
            `
        )
      return res.status(200).json({
        message: "successful",
        orderNum: orderNum,
        foodAmount: foodOrderedAmount,
        totalIncome: totalIncome,
        monthlyIncome: monthlyIncome,
        categoryDistribute: categoryDistribute,
        originDistribute: originDistribute[0],
        status: 200
      })
      
    }catch(e){
      console.log(e)
      return res.status(500).json({
        status: 500,
        message: "server error"
      })
    }
}

export const getAllDiscount= async ( req,res)=>{
  try{
    const discounts = await sequelizeInstance.query('SELECT * FROM discounts', {
      type: QueryTypes.SELECT,
    });
    if(discounts.length==0) return res.status(404).json({
      message:" there is no discount now",
      status:404
    })
    res.status(200).json({
      message:"successful",
      discounts: discounts,
      status: 200
    });
  }catch(e){
    console.log(e)
    res.status(500).json({
      message: "server error",
      status:404 
    })
  }
}
export const createDiscount= async (req,res)=>{
  try {
    const {
      name,
      value,
      detail,
      amount, 
      expiration_date,
      requirement,
    } = req.body;
    const createdat = new Date();
    const updatedat = new Date();
    if (!name || !value || !amount) {
      return res.status(400).json({
        message: "Missing required user fields",
        status: 400
      });
    }
    const safeName = name ?? '';
    const safeDetail = detail ?? '';
    const safeExpirationDate = expiration_date ?? '';
    const safeRequirement = requirement ?? "none";
    await sequelizeInstance.query(
      "INSERT INTO discounts (name,value,detail,amount, expiration_date,requirement,createdat, updatedat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      {
        replacements: [
          safeName,
          value,
          safeDetail,
          amount,
          safeExpirationDate,
          safeRequirement,
          createdat,
          updatedat
        ],
        type: sequelizeInstance.QueryTypes.INSERT
      }
    );

    res.status(201).json({
      message: "discount created successfully",
      status: 201
    });
  } catch (e) {
    console.error("Create user error:", e);
    res.status(500).json({
      message: "Server error",
      status: 500,
    });
  }
}
export const updateDiscount= async( req,res)=>{
  const id=req.params.id;
  if(!id)res.status(404).json({
    message:"discounts not found",
    status: 404
  })
  try {
    const {
      name,
      value,
      detail,
      amount, 
      expiration_date,
      requirement,
    } = req.body;
    const updatedat = new Date();
    if (!name || !value || !amount) {
      return res.status(400).json({
        message: "Missing required user fields",
        status: 400
      });
    }
    const safeName = name ?? '';
    const safeDetail = detail ?? '';
    const safeExpirationDate = expiration_date ?? '';
    const safeRequirement = requirement ?? "none";
    await sequelizeInstance.query(
      "UPDATE discounts name=?,value=?, detail=?, amount=?, expiration_date=? ,requirement=? ,updatedat=? WHERE id=?",
      {
        replacements: [
          safeName,
          value,
          safeDetail,
          amount,
          safeExpirationDate,
          safeRequirement,
          updatedat,
          id
        ],
        type: sequelizeInstance.QueryTypes.UPDATE
      }
    );

    res.status(202).json({
      message: "discount created successfully",
      status: 202
    });
  } catch (e) {
    console.error("Create user error:", e);
    res.status(500).json({
      message: "Server error",
      status: 500,
      error: e.message || e
    });
  }
}
export const deleteDiscount= async( req,res)=>{
  try{
    const id=req.params.id;
    if(!id)return res.status(404).json({
      message:"missing the id for, what are you tend to do",
      status: 404
    })
    await sequelizeInstance.query("DELETE FROM discounts WHERE id=?",{
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
