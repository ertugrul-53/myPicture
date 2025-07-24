import express from "express";
import multer from "multer";
import { getDB } from "../index.js";
import { ObjectId } from "mongodb";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // middleware'i import et
import fs from "fs";
import path from "path";


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });




  
// Burada önce token doğrulaması yapıyoruz, sonra dosya yükleme
router.post("/", authMiddleware, upload.single("photo"), async (req, res) => {
  console.log("upload endpoint çağrıldı");
  console.log("Token’dan gelen user:", req.user);  // req.user burada geliyor
  console.log("Gelen dosya:", req.file);

  const userId = req.user._id;  // token doğrulandıktan sonra user objesi burada
  const file = req.file;

  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Geçersiz userId" });
  }

  try {
    const db = getDB();
    console.log("DB bağlantısı:", db.databaseName);
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    console.log("Kullanıcı sorgu sonucu:", user);
    const picturesCollection = db.collection("pictures");

    const imagePath = "/upload/" + file.filename;

    const newPicture = {
      userId: new ObjectId(userId),
      imagePath,
      createAt: new Date(),
    };

    await picturesCollection.insertOne(newPicture);

    res.json({ success: true, picture: newPicture });
  } catch (error) {
    console.error("Fotoğraf yüklenemedi:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası", error: error.message });
  }
});




export default router;
