import express from "express";
import { getDB } from "../index.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ObjectId } from "mongodb";

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
router.get('/following/:userId', async (req, res) => {
  try {
    const db = getDB();
    const followCollection = db.collection("follows");
    const usersCollection = db.collection("users");

    const followingDocs = await followCollection
      .find({ followerID: req.params.userId })
      .toArray();

    const followingIds = followingDocs.map(f => f.followingId);

    const users = await usersCollection
      .find({ _id: { $in: followingIds.map(id => new ObjectId(id)) } })
      .project({ username: 1, profilePhotoUrl: 1 })
      .toArray();

    res.json(users);
  } catch (error) {
    console.error("Following getirme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

// Kullanıcıyı takip edenleri getir
router.get('/followers/:userId', async (req, res) => {
  try {
    const db = getDB();
    const followCollection = db.collection("follows");
    const usersCollection = db.collection("users");

    const followerDocs = await followCollection
      .find({ followingId: req.params.userId })
      .toArray();

    const followerIds = followerDocs.map(f => f.followerID);

    const users = await usersCollection
      .find({ _id: { $in: followerIds.map(id => new ObjectId(id)) } })
      .project({ username: 1, profilePhotoUrl: 1 })
      .toArray();

    res.json(users);
  } catch (error) {
    console.error("Followers getirme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

export default router;
