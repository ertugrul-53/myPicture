import React, { useState } from "react";
import axios from "axios";

function UploadPhotoForm({ onUploadSuccess, userId }) {
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

                    // userId props olarak yoksa localStorage’dan al
                    const currentUserId = userId || localStorage.getItem("userId");
                    if (!currentUserId) {
                      setMessage("Kullanıcı bilgisi bulunamadı.");
                      return;
                    }

                    const formData = new FormData();
                    formData.append("photo", selectedFile);
                    formData.append("userId", currentUserId);

                    try {
                      const token = localStorage.getItem("token");
                      if (!token) {
                        setMessage("Kullanıcı giriş yapmamış.");
                        return;
                      }

                      const response = await axios.post("http://localhost:5000/api/upload", formData, {
                        headers: {
                          "Content-Type": "multipart/form-data",
                          Authorization: `Bearer ${token}`,
                        },
                      });
                      console.log("Upload response:", response);

                      setMessage("Yükleme başarılı: " + response.data.picture.imagePath);

                      if (onUploadSuccess) {
                        await onUploadSuccess();
                      }
                    } catch (err) {
                      console.error(err);
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
