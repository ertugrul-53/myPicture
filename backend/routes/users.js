import express from "express";
import { getDB } from "../index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const limit = parseInt(req.query.limit) || 5;

    const users = await usersCollection.find({})
      .limit(limit)
      .toArray();

    res.json(users);
  } catch (err) {
    console.error("Kullanıcılar alınamadı", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

export default router;
