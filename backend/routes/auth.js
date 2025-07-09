import express from "express";
import { getDB } from "../index.js"; 

import bcrypt from "bcryptjs";

const router =express.Router();

router.post("/register",async(req,res)=>{
    const db =getData()
    const userColection =db.collection("users");
    const{username, password,email}=req.body;
    const existingUser = await userColection.findOne({email});
    
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
   
    await userColection.insertOne(newUser);
    res.status(201).json({message:"kayıt başarılı"});

});

    router.post("/login", async (req, res) => {
  const db = getDB();  // Veritabanına bağlan
  const usersCollection = db.collection("users"); // "users" koleksiyonunu al

  const { email, password } = req.body; // Kullanıcıdan gelen e-posta ve şifre

  // 1. E-posta ile kullanıcıyı bul
  const user = await usersCollection.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Kullanıcı bulunamadı" });
  }

  // 2. Şifre doğru mu kontrol et
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Şifre yanlış" });
  }

  // 3. Giriş başarılı
  res.json({ message: "Giriş başarılı 🎉", username: user.username });
});

 export default router; 
