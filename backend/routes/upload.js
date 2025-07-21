import express from "express";
import multer from "multer";
import { getDB } from "../index.js";
import { ObjectId } from "mongodb";


const router = express.Router();

// Multer ayarları: dosyalar uploads klasörüne kaydedilecek

const storage = multer.diskStorage({

        destination: (req, file, cb) => {
            cb(null, 'upload/'); 
        },
        filename: (req, file, cb) => {
        
            cb(null, Date.now() + "-" + file.originalname);              // Dosya adı için benzersiz isim yapıyoruz: timestamp + orijinal isim
        }
});

const upload = multer({ storage });

//       POST /upload — fotoğraf yükleme endpointi
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const db = getDB();
    const picturesCollection = db.collection("pictures");

    const {userId } =req.body; // kullanıcı ıd si request body sinden geliyor 
    const imagePath = "/upload/" + req.file.filename;


    const newPicture ={
        userId : new ObjectId(userId),
        imagePath,
        createAt : new Date(),
        };
    const result  = await picturesCollection.insertOne(newPicture);

    res.json({success : true ,picture : newPicture});

}catch(error){
    console.error("fotoğraf yüklenmedi",error);
    res.status(500).json({success : false , message : "sunucu hatası"});

}
});
export default router;
