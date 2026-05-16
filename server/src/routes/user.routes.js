

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




router.route("/register").post(upload.single('avatar'), registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refreshaccesstoken").post(verifyJWT, refreshAccessToken)
router.route("/changepassword").post(verifyJWT, changePassword)
router.route("/changeavatar").post(verifyJWT, upload.single('avatar'), changeAvatar)


export default router; 