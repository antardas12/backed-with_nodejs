


import conectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";



dotenv.config({
    path: './env'
});


conectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running at port ${process.env.PORT}`);
    });
})
.catch((error)=>{
    console.log("MONGODB CONNECTION ERROR !!!", error);
});







//efy function for db connection
// ;(async ()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
//         app.on("error",(error)=>{
//             console.log("ERR :",error);
//         });
//         app.listen(process.env.PORT,()=>{
//             console.log(`app is listening on port ${process.env.PORT}`);
//         });
//     }catch(error){
//         console.log("ERROR",error);
//     }
// })();