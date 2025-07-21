//token doğrulama

import { Jwt } from "jsonwebtoken";

//middleWare fonksiyonu
const authMiddleWare =(req,res,next)=>{

    const authHeader = req.heades.authorization;

    if(!authorization || authorization.startWith('Bearer')){
        return res.status(404).json({mesage:'Token bulunamadı  '});

    }
    const token = authHeader.split(" ")[1]; //Barear dan sonra gelen boşlukdan sonrasının alırız (gerçek token için )

    try{
        const decoded =fwt.verify(token,"gizli anahtar");
        req.user=decoded;
        next();

    }catch(error){
        return res.status(401).json({message: "geçersiz token"});
    }
}
export default authMiddleWare;