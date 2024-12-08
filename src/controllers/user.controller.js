import { asyncHendler } from "../utils/aysncHendler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHendler(async (req, res) => {
    //get user details from frontend 
    //validation-not empty
    //check is user already exists : username , email
    //check for image , for avatar
    // upload the on cloudinary ,avatar
    //create user object - create entity in db 
    //remove password and refresh token filed from response 
    //check for user creation
    //return response  

    const { fullname, username, email, password } = req.body;

    if (
        [fullname, username, email, password].some((filed) => filed?.trim() === "")
    ) {
        throw new ApiError(400, "all filed is required ")

    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "user with email or username already exist")
    }
    // const avatarLocalPath = req.files?.avatar[0]?.path;   


    let avatarLocalPath;
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
        avatarLocalPath =req.files.avatar[0].path;
    }
    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0){
        coverImageLocalPath =req.files.coverimage[0].path;
    }


    // const coverImageLocalPath = req.files?.coverimage[0]?.path;
    

    if(!avatarLocalPath) {
        throw new ApiError(400, "avatar is required ");
    }


    

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverimage = await uploadOnCloudinary(coverImageLocalPath);

    

    if (!avatar) {
        throw new ApiError(400, "avatar is required ");
    }

    const user = await User.create(
        {
            fullname,
            avatar: avatar.url,
            coverimage: coverimage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        }
    );

    const createUser = await User.findById(user._id).select(
        " -password -refreshToken "
    );

    if(!createUser){
        throw new ApiError(500, "something want  wrong  while registering the user")
    }
    
    return res.status(200).json(
        new ApiResponse(200, createUser,"User registered successfully ")
    )


})

export { registerUser }