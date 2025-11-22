import { sequelizeInstance } from "../config/bd.js";
import { QueryTypes } from "sequelize";
export const handleFood= async()=>{
    try{
        const foods= await sequelizeInstance.query("SELECT id, name, rating, origin, category, image, price, ingredient, detail  FROM food");
        if(foods.length==0) return {
            message:"There are no dishes in here",
            status: 404
          }
          return{
            foods:foods,
            message:"successful",
            status:200,
          }
      }catch{
         return {
          message:"Server error",
          status:500
        }
      }
}
export const handleSelectedFood= async(id)=>{
    try{
       
        if(!id) return {
            message:"choose one food first",
            status: 404
        }
        const food=await sequelizeInstance.query("SELECT name, rating, origin, category, image, ingredient, detail  FROM food WHERE id=?",
        {
            replacements: [id],
            type: sequelizeInstance.QueryTypes.SELECT
        })
        if(!dish) return {
            message:"can not find this food",
            status: 404
        }
        return {
            food:food,
            message: "successful",
            status: 200
        }
    }catch(e){
        return{
            message:" server error",
            status: 500
        }
        
    }
}