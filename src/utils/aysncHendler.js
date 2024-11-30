const asyncHendler = (requstHendaler) =>{
    (req,res,next) =>{
        Promise.resolve(requstHendaler(req,res,next))
        .catch((error) => next(error));
    }
}

export { asyncHendler }



// const asyncHendler = (fun) =>  async (req,res,next) =>{
//  try{
//     await fun(res,red,res)
//  }catch(error){
//     res.status(err.code || 500).jscon({
//         success : false,
//         massage : err.massage
//     })
//  }
// }