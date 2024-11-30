import mongoose from "mongoose";
import { DB_NAME } from '../constants.js';

const conectDB = async () =>{
    try{

    const connectionInstence =   await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    console.log(`mongodb connected !! DB HOST : ${connectionInstence.connection.host}`);
    }catch(error){
      console.log("mongodb connection error",error);
      process.exit(1);
    }
}
export default conectDB;