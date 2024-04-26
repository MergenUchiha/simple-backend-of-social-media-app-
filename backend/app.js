//Simple backend for social-media
//with posting blogs
//main file

import express from "express";
import mongoose from "mongoose";
import router from './routes/user.routes.js';
import blogRouter from "./routes/blog.routes.js";

const app = express();

app.use(express.json());
app.use("/user",router);//user routes
app.use("/blogs",blogRouter);//blog routes

//conecting database and listening server
mongoose
    .connect(
        "mongodb+srv://messorem:Uchiha_11@cluster0.fmdcvtt.mongodb.net/Blog?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
        app.listen(5000);
    })
    .then(console.log("Connected and Listening"))
    .catch((err) => console.log(err));
