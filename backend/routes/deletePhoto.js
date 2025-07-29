import express from "express";
import { getDB } from "../index.js";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";
import { authMiddleware } from "../middlewares/authMiddleware.js";  // Token doğrulama middleware

const router = express.Router();

router.delete("/delete-photo/:id", authMiddleware, async (req, res) => {
  const photoId = req.params.id;

  if (!ObjectId.isValid(photoId)) {
    return res.status(400).json({ success: false, message: "Geçersiz photoId" });
  }

  try {
    const db = getDB();
    const picturesCollection = db.collection("pictures");

    // Silinecek fotoğrafı bul
    const photo = await picturesCollection.findOne({ _id: new ObjectId(photoId) });
    if (!photo) {
      return res.status(404).json({ success: false, message: "Fotoğraf bulunamadı" });
    }

    // Sadece fotoğraf sahibi silebilir kontrolü
    if (photo.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Bu fotoğrafı silme yetkiniz yok" });
    }

    // Database  den  silme
    await picturesCollection.deleteOne({ _id: new ObjectId(photoId) });

    // Dosya sisteminden silme
    const filePath = path.join(process.cwd(), photo.imagePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Dosya silinemedi:", err);
      } else {
        console.log("Dosya silindi:", filePath);
      }
    });

    res.json({ success: true, message: "Fotoğraf silindi" });
  } catch (error) {
    console.error("Silme işlemi hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası" });
  }
});

export default router;
 