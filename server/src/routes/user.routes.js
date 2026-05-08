

import express from "express"
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js"

import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeAvatar,
    changePassword
} from "../controllers/user.controllers.js"


const router = express.Router();




router.route("/register").path(registerUser)
router.route("/login").path(loginUser)
router.route("/logout").path(logoutUser)







export default router; 