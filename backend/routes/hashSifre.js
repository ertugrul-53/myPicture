import bcrypt from "bcryptjs";

const yeniSifre = "1234"; 

bcrypt.hash(yeniSifre, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed şifre:", hash);
});
