
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
        trim: true,
        lowercase: true,
    },
    refreshToken: {
        type: String,
    }

}, { timestamps: true });



userSchema.pre("save", async function (req, res, next) {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCheck = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.createAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.createRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.userName
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


const User = mongoose.model("User", userSchema);





export { User }