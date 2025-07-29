import React, { useRef, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Modal, Button } from "react-bootstrap";
import "./UploadPhotoForm.css"

function UploadPhotoForm({ onUploadSuccess }) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false); // modal kontrolü
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setMessage(""); // önceki mesajı temizle
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Lütfen önce bir dosya seçin.");
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
        await onUploadSuccess();
      }

      setMessage(" Yükleme başarılı!");
      setSelectedFile(null);
      setTimeout(() => setShowModal(false), 1500); // 1.5 saniye sonra modal kapansın
    } catch (err) {
      console.error("Yükleme hatası:", err);
      setMessage(" Yükleme başarısız.");
    }
  };

  return (
    <div className="upload-form">
      {/*  İkon */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "10px",
        }}
        title="Fotoğraf Yükle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          fill="currentColor"
          className="bi bi-capslock-fill"
          viewBox="0 0 16 16"
        >
          <path d="M7.27 1.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1H1.654C.78 9.5.326 8.455.924 7.816zM4.5 13.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1z" />
        </svg>
      </button>

      {/*  Modal Penceresi */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📸 Fotoğraf Yükle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" onChange={handleFileChange} ref={fileInputRef} />
          {selectedFile && <p>Seçilen: {selectedFile.name}</p>}
          {message && <p>{message}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Vazgeç
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Yükle
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UploadPhotoForm;
