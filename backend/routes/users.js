import express from "express";
import { getDB } from "../index.js";




const router = express.Router();




// mainPge deki users kısmı 
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;

    const users = await usersCollection.find({})
     
      .skip(skip)
      .limit(limit)
      .toArray();

    res.json(users);
  } catch (err) {
    console.error("Kullanıcılar alınamadı", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});







export default router;
