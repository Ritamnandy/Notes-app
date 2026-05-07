
import mongoose from "mongoose";

import { db_Name } from "../constants.js";

const connectMongoDB = async () => {
    try {
        const response = await mongoose.connect(`${process.env.MONGODB_URL}/${db_Name}`)
        console.log("database connected !! DB host:- ", response.connection.host);

    } catch (error) {
        console.log("database not connected", error);

    }
}

export { connectMongoDB }