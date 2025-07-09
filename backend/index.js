import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js"


dotenv.config();

const app =express();
app.use(cors());
app.use(express.json());
app.use("/api",authRouter);

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

    