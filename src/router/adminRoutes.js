import express from "express"
import verifyAdminJWT from "../misddleware/verifyAdminJWT.js";
import { createDiscount, 
      createFood, 
      deleteDiscount, 
      deleteFood, 
      getAllDiscount, 
      getAllFoods, 
      getAllOrders, 
      getAllUser, 
      getOrderStatistic, 
      getUserStatistic, 
      updateDiscount, 
      updateFood } from "../services/adminServices.js";
const adminRoutes=express.Router();
adminRoutes.get('/users',verifyAdminJWT,getAllUser);
adminRoutes.get('/users/statis',verifyAdminJWT,getUserStatistic);

adminRoutes.get('/food',verifyAdminJWT,getAllFoods);
adminRoutes.post('/food',verifyAdminJWT,createFood);
adminRoutes.put('/food/:id',verifyAdminJWT,updateFood);
adminRoutes.delete('/food/:id',verifyAdminJWT,deleteFood);

adminRoutes.get('/orders',verifyAdminJWT, getAllOrders);
adminRoutes.get('/orders/statis',verifyAdminJWT,getOrderStatistic)

adminRoutes.get('/discounts',verifyAdminJWT,getAllDiscount)
adminRoutes.post('/discounts',verifyAdminJWT,createDiscount)
adminRoutes.put('/discounts/:id',verifyAdminJWT,updateDiscount)
adminRoutes.delete('/discounts/:id',verifyAdminJWT,deleteDiscount)


export default adminRoutes