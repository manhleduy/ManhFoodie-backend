import { sequelizeInstance } from "../config/bd.js";
export const handleGetDisCounts= async ()=>{
    try{
        const discounts= await sequelizeInstance.query("SELECT id, name,value, detail, amount, requirement, expiration_date  FROM discounts");
        if(discounts.length==0) return {
            message:"There are no dishes in here",
            status: 404
          }
          return{
            discounts:discounts,
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
export const handleGetSelectedDiscounts=async(id)=>{
    try{
        if(!id) return {
            message:"choose one food first",
            status: 404
        }
        const food=await sequelizeInstance.query("SELECT id, name,value, detail, amount, requirement, expiration_date FROM discounts WHERE id=?",
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