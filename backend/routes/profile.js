import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

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





export default router;
