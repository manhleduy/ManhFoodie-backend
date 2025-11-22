import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config()
// Option 3: Passing parameters separately (other dialects)
export const sequelizeInstance = new Sequelize(
    process.env.DB_DATABASE_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "postgres",
      post: process.env.BD_PORT,
      dialectOptions: {
        ssl: {
            require: true, 
            rejectUnauthorized: false 
        }
      },
      logging:false
    }
    );
export const connectDB= async()=>{
    try {
    await sequelizeInstance.authenticate();
    console.log('Connection has been established successfully.');
    } catch (error) {
    console.error('Unable to connect to the database:', error);
    }
}
