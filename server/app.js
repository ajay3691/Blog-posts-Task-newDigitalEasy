import express from "express";
let app = express()

import mongoose from "mongoose";
import UserRouter from "./routers/UserRouter.js";
import PostRouter from "./routers/PostRoutes.js";
import { authenticateToken } from "./routers/middlewere.js";
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import bodyParser from "body-parser";

app.use(bodyParser.json());

app.use(cors({ origin: "*" }))
//app.use(cors());
app.use(morgan('tiny'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


 
app.use('/user', UserRouter); 
app.use('/post', authenticateToken, PostRouter);

app.get("/", (req, resp) => {
    resp.send("Express App - Root APi.......")
})

dotenv.config({ path: './config/config.env' })
let port = process.env.PORT
let host = process.env.HOST
let mongodb_url = process.env.MONGODB_URL

mongoose.connect(mongodb_url , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} )
    .then(() => {
        console.log(`Mongo db conection Succesfull`)
    })
    .catch((err) => {
        console.log(`Mongo db Conection failed`)
    })
app.listen(port, host, (err) => {
    if (err) throw err
    console.log(`Server Running on http://${host}:${port}`)
})