import express from "express";
import cors from "cors";  
import { MongoClient, GridFSBucket } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// API uçları
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import picturesRouter from "./routes/pictures.js";
import uploadRouter from "./routes/upload.js";
import profileRoute from "./routes/profile.js";
import deletePhotoRoute from "./routes/deletePhoto.js";
import likesRouter from "./routes/like.js";
import followRouter from "./routes/followRouter.js";
import settingsRouter from "./routes/settings.js";

// ROUTES
app.use("/api/pictures", picturesRouter);
app.use("/api/users", usersRouter);
app.use("/api", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/profile", profileRoute);
app.use("/api", deletePhotoRoute);
app.use("/api/likes", likesRouter);
app.use("/api/follow", followRouter);
app.use("/api/settings", settingsRouter);

// MongoDB Bağlantısı
const PORT = process.env.PORT || 5000;
const mongoURL = process.env.MONGO_URL || "mongodb://mongo:27017/myPictures";

let db;
let gfsBucket;

async function connectMongo() {
    try {
        const client = await MongoClient.connect(mongoURL);
        db = client.db("myPictures");
        gfsBucket = new GridFSBucket(db, { bucketName: "photos" });
        console.log("MongoDB'ye bağlandı ✅");
    } catch (err) {
        console.error("MongoDB'ye bağlanamadı ❌", err);
        process.exit(1); 
    }
}

// Sunucu başlatma
app.get("/", (req, res) => res.send("Sunucu çalışıyor 🚀"));

connectMongo().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Sunucu ${PORT} portunda çalışıyor`);
    });
});

// DB ve GridFS fonksiyonları
export function getDB() {
    return db;
}

export function getGFSBucket() {
    return gfsBucket;
}
