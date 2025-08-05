import express from "express";
import cors from "cors";   // farklı port etkileşimi için
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

//API uçları (ROUtES)
import authRouter from "./routes/auth.js"
import usersRouter from "./routes/users.js";
import picturesRouter from "./routes/pictures.js";
import uploadRouter from "./routes/upload.js";
import profileRoute from "./routes/profile.js";
import deletePhotoRoute from "./routes/deletePhoto.js"

import likesRouter from "./routes/like.js";
import followRouter from "./routes/followRouter.js";




const app =express();
dotenv.config();


app.use(cors());
app.use(express.json());   


app.use("/api/pictures", picturesRouter);
app.use("/api/users", usersRouter);
app.use("/api",authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/profile",profileRoute);
app.use('/upload', express.static('upload'));
app.use("/api", deletePhotoRoute)

app.use("/api/likes", likesRouter);
app.use("/api/follow",followRouter);

//MongoDB
const PORT = 5000;
const mongoURL = process.env.MONGO_URL;

let db;

MongoClient.connect(mongoURL)
    .then((client)=> {
        db =client.db("myPictures");
        console.log("mongo db ye bağlandı ");
    })
    .catch((err)=> console.error("mongo db bağlanmadı",err));
   
   
    app.get("/",(req,res)=>{
        res.send("sunucu çalışıyor");
    });

    app.listen(PORT,()=>{
        console.log(`sunucu ${PORT} adresinde çalışıyor`)
    });



    export function getDB(){
        return db;
    }

    