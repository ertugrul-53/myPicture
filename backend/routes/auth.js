import express from "express";
import { getDB } from "../index.js"; 
import bcrypt from "bcryptjs";
import  jwt from "jsonwebtoken";

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
  const db = getDB();  
  const usersCollection = db.collection("users"); 

  const { email, password } = req.body; 

  // 1. E-posta ile kullanıcıyı bul
  const user = await usersCollection.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Kullanıcı bulunamadı" });
  }

  // 2. Şifre doğru mu kontrol 
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Şifre yanlış" });
  }


   const token = jwt.sign({email: user.email,username:user.username},
                           "key",
                           {expiresIn:"1m"}             
   );
   res.json({
    message: "Giriş başarılı ",
    token,
    username: user.username,
  });


});

  
 export default router; 
