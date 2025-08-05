import express from "express";
import { getDB } from "../index.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

const router = express.Router();

// KULLANICI BİRİNİ TAKİP EDER
router.post("/", authMiddleware, async (req, res) => {
  const followerID = req.userId; // token'dan gelen kullanıcı ID
  const { followingId } = req.body;

  if (!followerID || !followingId) {
    return res.status(400).json({ message: "Eksik bilgiler." });
  }

  try {
    const db = getDB();
    const followCollection = db.collection("follows");

    // Aynı kişi zaten takip ediyorsa tekrar ekleme
    const existingFollow = await followCollection.findOne({ followerID, followingId });

    if (existingFollow) {
      return res.status(200).json({ message: "Zaten takip ediliyor." });
    }

    await followCollection.insertOne({ followerID, followingId });

    res.status(201).json({ message: "Takip işlemi başarılı." });
  } catch (error) {
    console.error("Takip hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

// KULLANICI TAKİPTEN ÇIKAR
router.post("/unfollow", authMiddleware, async (req, res) => {
  const followerID = req.userId;
  const { followingId } = req.body;

  if (!followerID || !followingId) {
    return res.status(400).json({ message: "Eksik bilgiler." });
  }

  try {
    const db = getDB();
    const followCollection = db.collection("follows");

    await followCollection.deleteOne({ followerID, followingId });

    res.status(200).json({ message: "Takipten çıkıldı." });
  } catch (error) {
    console.error("Unfollow hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

// BİR KULLANICIYI TAKİP EDİYOR MU KONTROL ET
router.get("/status", authMiddleware, async (req, res) => {
  const followerID = req.userId;
  const { followingId } = req.query;

  if (!followerID || !followingId) {
    return res.status(400).json({ message: "Eksik bilgiler." });
  }

  try {
    const db = getDB();
    const followCollection = db.collection("follows");

    const existingFollow = await followCollection.findOne({ followerID, followingId });

    res.status(200).json({ isFollowing: !!existingFollow });
  } catch (error) {
    console.error("Durum kontrol hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});


// Kullanıcının takip ettiklerini getir
router.get('/follow/following/:userId', async (req, res) => {
  const following = await Follow.find({ followerID: req.params.userId }).populate('followingId', 'username profilePhotoUrl');
  res.json(following.map(f => f.followingId));
});

// Kullanıcıyı takip edenleri getir
router.get('/follow/followers/:userId', async (req, res) => {
  const followers = await Follow.find({ followingId: req.params.userId }).populate('followerID', 'username profilePhotoUrl');
  res.json(followers.map(f => f.followerID));
});


export default router;
