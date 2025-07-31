//token kontrolu 
import jwt from "jsonwebtoken";
import { getDB } from "../index.js";
import { ObjectId } from "mongodb";

const secretKey = process.env.JWT_SECRET || "gizliAnahtar";

export const authMiddleware = async (req, res, next) => {
  
  try {
     const authHeader = req.headers["authorization"];
console.log("Auth Header:", authHeader);
    if (!authHeader) {
      return res.status(401).json({ message: "Token bulunamadı" });
    }

    const token = authHeader.split(" ")[1];
    

    
    const decoded = jwt.verify(token, secretKey);


    const userId = decoded.userId;
     console.log("Decoded token userId:", userId);

    const db = await getDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
     console.log("User from DB:", user);

    if (!user) {
      return res.status(401).json({ message: "Kullanıcı bulunamadı" });
    }

    req.user = user;
    next();
  } catch (error) {
console.error("Middleware error:", error);
    return res.status(401).json({ message: "Geçersiz token", error: error.message });
  }
};
