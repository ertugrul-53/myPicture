// JWT token işlemleri için jsonwebtoken kütüphanesini içe aktar
import jwt from "jsonwebtoken";

// .env dosyasındaki gizli anahtar gibi verileri okumak için dotenv kütüphanesi
import dotenv from "dotenv";
dotenv.config(); // .env dosyasını aktif hâle getirir

// Middleware fonksiyonu: route'lara erişmeden önce çalışır
const authMiddleware = (req, res, next) => {
  // 1. İstek başlığından 'Authorization' değerini al
  const authHeader = req.headers.authorization;

  // 2. Eğer authorization başlığı yoksa ya da 'Bearer' ile başlamıyorsa hata döndür
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token bulunamadı veya hatalı formatta" });
  }

  // 3. 'Bearer <token>' formatındaki token'dan sadece token kısmını al
  const token = authHeader.split(" ")[1];

  try {
    // 4. Token'ı doğrula (doğruysa içindeki kullanıcı bilgilerini alır)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. decoded objesini req.user içine koy → route'larda kullanıcı bilgisi erişilebilir olur
    req.user = decoded;

    // 6. Bir sonraki middleware ya da route handler'a geç
    next();
  } catch (error) {
    // Token doğrulanamazsa
    return res.status(401).json({ message: "Geçersiz token" });
  }
};

// Bu middleware fonksiyonunu dışa aktar
export default authMiddleware;
