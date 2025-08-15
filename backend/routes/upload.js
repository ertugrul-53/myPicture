import express from "express";
import multer from "multer";
import { getDB } from "../index.js";
import { ObjectId } from "mongodb";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// Multer storage ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 📌 Normal fotoğraf yükleme endpoint
router.post("/", authMiddleware, upload.single("photo"), async (req, res) => {
  console.log("upload endpoint çağrıldı");
  console.log("Token’dan gelen user:", req.user);
  console.log("Gelen dosya:", req.file);

  const userId = req.user._id;
  const file = req.file;

  if (!userId || !ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Geçersiz userId" });
  }

  try {
    const db = getDB();
    const picturesCollection = db.collection("pictures");

    const imagePath = "/uploads/" + file.filename;

    const newPicture = {
      userId: new ObjectId(userId),
      imagePath,
      createdAt: new Date(),
    };

    await picturesCollection.insertOne(newPicture);

    res.json({ success: true, picture: newPicture });
  } catch (error) {
    console.error("Fotoğraf yüklenemedi:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası", error: error.message });
  }
});

// 📌 Profil fotoğrafı yükleme endpoint (404 hatasını çözen kısım)

router.post("/profile", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const db = getDB();
    const users = db.collection("users");

    if (!req.file) return res.status(400).json({ message: "Dosya yok" });

    const imagePath = `/uploads/${req.file.filename}`;

    // Kullanıcının profil fotoğrafını güncelle
    await users.updateOne(
      { _id: new ObjectId(req.user._id) },
      { $set: { profilePhotoUrl: imagePath } }
    );

    res.json({ message: "Profil fotoğrafı güncellendi", profilePhotoUrl: imagePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Yükleme hatası" });
  }
});




export default router;
