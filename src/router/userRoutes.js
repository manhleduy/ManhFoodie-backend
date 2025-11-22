import express from "express"

import {
    getFoodByIdFromUser,
    getAllFoodsFromUser,
    getUserOrders,
    getOrderByIdFromUser as getOneUserOrder,
    Order,
    updateOrderFromUser as updateUserOrder,
    deleteOrderFromUser as deleteUserOrder,
    HandleSignIn,
    HandleSignUp,
    HandleSignOut,
    CountOrderNum,
    ExpenseTable,
    CategoryDistributeTable,
    GetUser,
    handleSendOTP,
    handleVerifyOTP,
    handleResetOTP,
    UpdateUserInfo,
    getDiscounts,
    getDiscount,
    handleSendUserEmail
 } from "../services/userServices.js";
import verifyJWT from '../misddleware/verifyJWT.js'
import handleRefreshToken from "../services/refreshTokenServices.js";

const userRoutes=express.Router();

userRoutes.get('/refreshToken', handleRefreshToken)

userRoutes.post('/users/signin', HandleSignIn);
userRoutes.post('/users/signup',HandleSignUp);
userRoutes.post('/users/signout', HandleSignOut);
userRoutes.post('/users/info',verifyJWT, GetUser);
userRoutes.put('/users',verifyJWT, UpdateUserInfo);


userRoutes.get('/food',getAllFoodsFromUser);
userRoutes.get('/food/:id',getFoodByIdFromUser);


userRoutes.post('/orders/ordernum',verifyJWT, CountOrderNum);
userRoutes.post('/orders/expense',verifyJWT, ExpenseTable);
userRoutes.post('/orders/piechart',verifyJWT, CategoryDistributeTable)

userRoutes.get('/orders/:email',verifyJWT,getUserOrders);
userRoutes.get('/orders/:userid/:id',verifyJWT,getOneUserOrder);

userRoutes.post('/orders',verifyJWT,Order);

userRoutes.put('/orders/:id',updateUserOrder);
userRoutes.delete('/orders/:id',deleteUserOrder);



userRoutes.post('/recoveryEmail/OTPemail',handleSendOTP);
userRoutes.post('/recoveryEmail/verifyOTP', handleVerifyOTP);
userRoutes.get('/recoveryEmail/resetOTP', handleResetOTP);

userRoutes.post('/sendEmail',verifyJWT, handleSendUserEmail);

userRoutes.get('/discounts',getDiscounts);
userRoutes.get('/discounts/:id',getDiscount);


export default userRoutes