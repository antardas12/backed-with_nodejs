import { asyncHendler } from "../utils/aysncHendler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";



const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(401, "something want wrong while generate access and refresh token")
    }
}


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
    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path;
    }

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverImageLocalPath = req.files.coverimage[0].path;
    }


    // const coverImageLocalPath = req.files?.coverimage[0]?.path;


    if (!avatarLocalPath) {
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

    if (!createUser) {
        throw new ApiError(500, "something want  wrong  while registering the user")
    }

    return res.status(200).json(
        new ApiResponse(200, createUser, "User registered successfully ")
    )


});


const logInUser = asyncHendler(async (req, res) => {

    // data from front end
    //user name or email
    //find the user
    //check password 
    //access token and refresh token 
    //send cookie


    const { email, username, password } = req.body;

    if ( !(username || email)) {
        throw new ApiError(400, "email or username are required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "user is not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "password is not valid ")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                user: loggedInUser, accessToken, refreshToken
            },
                "user logged in successfully "
            )
        )


});

const logoutUser =asyncHendler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200, {},"user successfully loggout ")
    )

})

export {

    registerUser,
    logInUser,
    logoutUser
}