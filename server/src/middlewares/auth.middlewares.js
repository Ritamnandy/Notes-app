

import jwt from "jsonwebtoken";

import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/apierror.js"

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
        if (!token) {
            return res.status(401).json(new ApiError(401, "Unauthorized request", ["Access token is missing,please login"]))
        }
        const information = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(information?._id)
        if (!user) {
            return res.status(401).json(new ApiError(401, "invalid access token", ["Invalid Access token "]))
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json(new ApiError(401, "Unauthorized request", ["Access token is missing,please login"]))

    }
})