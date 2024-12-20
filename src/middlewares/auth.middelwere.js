import { User } from "../models/users.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHendler } from "../utils/aysncHendler.js";
 
import jwt from "jsonwebtoken";
export const verifyJWT = asyncHendler(async (req,_,next)=>{

try {
       const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("bearer", "")
       if(!token){
        throw new ApiError(401,"Unauthorized request")
       }
    
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    
     const user =await User.findById(decodedToken._id).select("-password -refreshToken")
    
     if(!user){
        throw new ApiError(401,"Invalid access token")
     }

     req.user=user;
     next();

} catch (error) {
    
    throw new ApiError(401, error?.message  || "invalid accesstoken")
}


});