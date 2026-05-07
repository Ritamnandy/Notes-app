
import dotenv from "dotenv"
import { connectMongoDB } from "./db/db.connection.js"
import { app } from "./app.js"

dotenv.config()


const port = process.env.PORT;

connectMongoDB().then(() => {
    app.listen(port, () => {
        console.log("server running at port:- ", port);

    })
}).catch((error) => {
    console.log("server can not start", error);

})






