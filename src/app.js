import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use(express.static("public"))

app.use(cookieParser())


// Routes import
import userRouter from './routes/user.routes.js'
import productRouter from "./routes/product.routes.js";
import adminRouter from "./routes/admin.routes.js"



app.use("/api/v2/products", productRouter);



//routes declaration

app.use("/api/v2/users", userRouter)
app.use("/api/v2/admin",adminRouter)



export {app}