import React, { useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";  // doğru import burada

function UploadPhotoForm({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Lütfen bir dosya seçin.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Kullanıcı giriş yapmamış.");
      return;
    }

    let currentUserId;
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.userId;
    } catch (error) {
      console.error("Token çözümleme hatası:", error);
      setMessage("Geçersiz kullanıcı token’ı.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);
    formData.append("userId", currentUserId);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Upload response:", response);

      if (onUploadSuccess) {
        await onUploadSuccess(); // yükleme başarılıysa üst componente bildir
      }

      setMessage("Yükleme başarılı.");
    } catch (err) {
      console.error("Yükleme hatası:", err);
      setMessage("Yükleme başarısız.");
    }
  };

  return (
    <div className="upload-form">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Yükle</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default UploadPhotoForm;
