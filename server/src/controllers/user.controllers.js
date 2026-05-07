

import { asyncHandler } from "../utils/asynchandler.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { User } from "../models/user.models.js"


const options = {
    httpOnly: true,
    secure: true
}

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const refreshToken = await user.createRefreshToken();
        const accessToken = await user.createAccessToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })
        { refreshToken, accessToken }
    } catch (error) {
        console.log(error);

    }
}





const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body
    if (!userName || !email || !password) {
        return res.status(400).json(new ApiError(400, "Bad request", ["All fields are required!!"]))
    }
    if (userName === "" || email === "" || password === "") {
        return res.status(400).json(new ApiError(400, "Bad request", ["All fields are required!!"]))
    }
    const existedUser = await User.findOne({ userName })

    if (existedUser) {
        return res.status(409).json(new ApiError(409, "user already exists", ["user already exists"]))
    }
    const avatarLocalPath = req.file?.path || null;
    if (!avatarLocalPath) {
        return res.status(400).json(new ApiError(400, "avatar required", ["avatar required"]))
    }
    const avatarCloudinaryPath = await uploadCloudinary(avatarLocalPath);
    if (!avatarCloudinaryPath) {
        return res.status(400).json(new ApiError(400, "avatar required", ["avatar required"]))
    }

    const user = await User.create({ userName: userName.toLowerCase(), email, password, avatar: avatarCloudinaryPath.url })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        return res.status(500).json(new ApiError(500, "Somthing went wrong", ["Somthing wrong please try again"]))
    }
    return res.status(201).json(new ApiResponse(201, createdUser, "user created successfully",))

})


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json(new ApiError(400, "Bad request", ["All fields are required!!"]))
    }
    if (email === "" || password === "") {
        return res.status(400).json(new ApiError(400, "Bad request", ["All fields are required!!"]))
    }
    const user = await User.findOne({
        email
    })
    if (!user) {
        return res.status(404).json(new ApiError(404, "User not found", ["User not found"]))
    }

    const isPasswordCorrect = user.isPasswordCheck(password)
    if (!isPasswordCorrect) {
        res.status(400).json(new ApiError(400, "Password is not currect", ["enter valid password"]))
    }


    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    return res.status(200)
        .cookie("RefreshToken", refreshToken, options)
        .cookie("AccessToken", accessToken, options)
        .json(new ApiResponse(200, { loggedInUser, refreshToken: refreshToken, accessToken: accessToken }, "loggedin Sucessfully"))

})





export {
    registerUser,
    loginUser
}