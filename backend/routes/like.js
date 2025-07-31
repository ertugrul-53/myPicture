import express from "express";
import { getDB } from "../index.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Beğeni togglesi: kullanıcı beğenmişse kaldırır, beğenmemişse ekler
router.post("/toggle", authMiddleware, async (req, res) => {
  const { pictureId } = req.body;
  const userId = req.user._id.toString();

  if (!userId || !pictureId)
    return res.status(400).json({ message: "userId ve pictureId gerekli" });

  try {
    const db = getDB();
    const userCollection = db.collection("users");
    const likesCollection = db.collection("likes");

    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    const username = user ? user.username : null;

    // ObjectId'ye çevir
    const userObjectId = new ObjectId(userId);
    const pictureObjectId = new ObjectId(pictureId);

    // Beğeni kontrolü
    const existingLike = await likesCollection.findOne({
      userId: userObjectId,
      pictureId: pictureObjectId,
    });

    if (existingLike) {
      await likesCollection.deleteOne({ _id: existingLike._id });
      return res.json({ liked: false });
    } else {
      await likesCollection.insertOne({
        username,
        userId: userObjectId,
        pictureId: pictureObjectId,
        createAt: new Date(),
      });
      return res.json({ liked: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Bir fotoğrafın toplam beğeni sayısını döner
router.get("/count/:pictureId", async (req, res) => {
  const { pictureId } = req.params;

  try {
    const db = getDB();
    const likesCollection = db.collection("likes");

    const pictureObjectId = new ObjectId(pictureId);

    const count = await likesCollection.countDocuments({ pictureId: pictureObjectId });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// Kullanıcının o fotoğrafı beğenip beğenmediğini gösterme
router.get("/status/:pictureId", authMiddleware, async (req, res) => {
  const pictureId = req.params.pictureId;
  const userId = req.user._id.toString();

  try {
    const db = getDB();
    const likesCollection = db.collection("likes");

    const userObjectId = new ObjectId(userId);
    const pictureObjectId = new ObjectId(pictureId);

    const existingLike = await likesCollection.findOne({
      userId: userObjectId,
      pictureId: pictureObjectId,
    });

    res.json({ liked: !!existingLike });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

export default router;
