
import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getDB } from "../index.js";
import { ObjectId } from "mongodb";
const router = express.Router();


router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = req.user; // Middleware'den gelen kullanıcı objesi

    if (!user) {
      return res.status(401).json({ message: "Kullanıcı doğrulanamadı" });
    }

    
    res.json({
      message: "Profil bilgileri getirildi",
      username: user.username,
      email: user.email,
      // başka bilgiler varsa eklenebilir
    });

  } catch (error) {
    console.error("Profil çekme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});



router.get("/photos", authMiddleware, async (req, res) => {
  try {

    
    const db = getDB();
    const userId = req.user._id;  // authMiddleware'den gelen kullanıcı objesi
    const photos = await db.collection("pictures").find({ userId: new ObjectId(userId) }).toArray();

    res.json(photos);
  } catch (error) {
    console.error("Profil fotoğrafları getirme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});




export default router;
