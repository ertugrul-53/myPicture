import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getDB } from "../index.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const router = express.Router();

// GET /api/settings -> aktif kullanıcının bilgileri
router.get("/", authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(req.userId) },
      { projection: { password: 0, token: 0 } }
    );
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    res.json(user);
  } catch (err) {
    console.error("Settings GET error:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// PUT /api/settings -> kullanıcı bilgilerini güncelle
router.put("/", authMiddleware, async (req, res) => {
  try {
    const db = getDB();
    const { username, email, password, profilePhotoUrl } = req.body;

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (profilePhotoUrl) updates.profilePhotoUrl = profilePhotoUrl;
    if (password && password.trim()) {
      updates.password = await bcrypt.hash(password, 10);
    }

    // e-posta değişiyorsa çakışma kontrolü
    if (email) {
      const exists = await db.collection("users").findOne({
        email,
        _id: { $ne: new ObjectId(req.userId) },
      });
      if (exists) {
        return res.status(400).json({ message: "Bu e-posta zaten kayıtlı." });
      }
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: updates }
    );

    res.json({ message: "Bilgiler güncellendi." });
  } catch (err) {
    console.error("Settings PUT error:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

export default router;
