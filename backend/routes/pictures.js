import express from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const picturesCollection = db.collection("pictures");
    const likesCollection = db.collection("likes");

    const userId = req.query.userId;
    const limit = parseInt(req.query.limit) || 5;
    const skip = parseInt(req.query.skip) || 0;

    let query = {};
    if (userId && ObjectId.isValid(userId)) {
      query.userId = new ObjectId(userId);
    }

    const pictures = await picturesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Her resim için beğeni sayısını al
    const picturesWithLikes = await Promise.all(
      pictures.map(async (picture) => {
       const likeCount = await likesCollection.countDocuments({ pictureId: picture._id});


        return {
          ...picture,
          likeCount,
        };
      })
    );

    res.json(picturesWithLikes);
  } catch (error) {
    console.error("Fotoğraflar çekilemedi:", error);
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
});

export default router;
