import express from "express";
import multer from "multer";
import { getDB, getGFSBucket } from "../index.js";
import { ObjectId } from "mongodb";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📌 Normal fotoğraf yükleme endpoint (GridFS)
router.post("/", authMiddleware, upload.single("photo"), async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!userId || !ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Geçersiz userId" });
    }
    if (!file) {
      return res.status(400).json({ success: false, message: "Dosya yok" });
    }

    const db = getDB();
    const gfs = getGFSBucket();
    const picturesCollection = db.collection("pictures");

    // GridFS’e yazma
    const uploadStream = gfs.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    uploadStream.end(file.buffer);

    uploadStream.on("finish", async (uploadedFile) => {
      const newPicture = {
        userId: new ObjectId(userId),
        fileId: uploadedFile._id, // GridFS file id
        filename: uploadedFile.filename,
        createdAt: new Date(),
      };
      await picturesCollection.insertOne(newPicture);

      res.json({ success: true, picture: newPicture });
    });

    uploadStream.on("error", (err) => {
      console.error("GridFS yükleme hatası:", err);
      res.status(500).json({ success: false, message: "GridFS yükleme hatası", error: err.message });
    });
  } catch (error) {
    console.error("Upload hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası", error: error.message });
  }
});

// 📌 Profil fotoğrafı yükleme endpoint (GridFS)
router.post("/profile", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "Dosya yok" });

    const db = getDB();
    const gfs = getGFSBucket();
    const users = db.collection("users");

    const uploadStream = gfs.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    uploadStream.end(file.buffer);

    uploadStream.on("finish", async (uploadedFile) => {
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { profilePhotoFileId: uploadedFile._id, profilePhotoName: uploadedFile.filename } }
      );

      res.json({ message: "Profil fotoğrafı güncellendi", fileId: uploadedFile._id });
    });

    uploadStream.on("error", (err) => {
      console.error("GridFS profil yükleme hatası:", err);
      res.status(500).json({ message: "Profil yükleme hatası", error: err.message });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Yükleme hatası" });
  }
});

export default router;
