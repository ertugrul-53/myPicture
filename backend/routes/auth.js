import express from "express";
import { getDB } from "../index.js"; 
import bcrypt from "bcryptjs";
import  jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router =express.Router();

router.post("/register",async(req,res)=>{
    const db =getDB();
    const userCollection =db.collection("users");
    const{username, password,email}=req.body;
    const existingUser = await userCollection.findOne({email});
    
    if(existingUser){
        return res.status(400).json({message:"bu eposta daha onece kullanıldı "});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
                        username,
                        password: hashedPassword,
                        email,
                        createAt: new Date()
};
   
    await userCollection.insertOne(newUser);
    res.status(201).json({message:"kayıt başarılı"});

});




   router.post("/login", async (req, res) => {
  try {
    const db = getDB();  
    const usersCollection = db.collection("users"); 

    const { email, password } = req.body; 

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Şifre yanlış" });
    }

    const token = jwt.sign(
      { email: user.email, username: user.username },
      process.env.JWT_SECRET || "key",  
      { expiresIn: "1h" }
    );

    await usersCollection.updateOne(
      { email: user.email },
      { $set: { token: token } }
    );

    res.status(200).json({
      message: "Giriş başarılı",
      token,
      username: user.username,
    });
  } catch (error) {
    console.error("Login hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});


  
 export default router; 
