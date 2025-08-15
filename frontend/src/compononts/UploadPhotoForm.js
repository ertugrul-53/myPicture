import React, { useRef, useState, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Modal, Button } from "react-bootstrap";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import "./UploadPhotoForm.css";

function UploadPhotoForm({ onUploadSuccess }) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1); // Zoom state eklendi
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const ASPECT = 1350 / 700; // Slider ölçü oranı

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setMessage("");

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      setMessage("Lütfen önce bir fotoğraf seçip kırpın.");
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

    try {
      setIsUploading(true);

      // Kırpılmış resmi al
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        1300,
        700
      );

      const formData = new FormData();
      formData.append("photo", croppedBlob, "photo.jpg");
      formData.append("userId", currentUserId);

      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Upload response:", response);
      onUploadSuccess && (await onUploadSuccess());

      setMessage("Yükleme başarılı!");
      setSelectedFile(null);
      setImageSrc(null);
      setZoom(1); // Zoom sıfırla
      setCrop({ x: 0, y: 0 }); // Crop sıfırla
      setTimeout(() => setShowModal(false), 1500);
    } catch (err) {
      console.error("Yükleme hatası:", err);
      setMessage("Yükleme başarısız.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setShowModal(false);
  };

  return (
    <div className="upload-form">
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

      <Modal className="custom-modal" show={showModal} onHide={handleCancel} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title> Fotoğraf Yükle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!imageSrc && (
            <>
              <input
              className="input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              {selectedFile && <p>Seçilen: {selectedFile.name}</p>}
            </>
          )}
          {imageSrc && (
            <div style={{ position: "relative", width: "100%", height: 500 }}>
                <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={ASPECT}          // 1300 / 480 sabit
                cropShape="rect"
                showGrid={true}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                restrictPosition={false} // crop penceresini fotoğrafın üzerinde serbest hareket ettirebilmek için
                />
            </div>
          )}
          {message && <p style={{ marginTop: 10 }}>{message}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Vazgeç
          </Button>
          {imageSrc ? (
            <Button variant="primary" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Yükleniyor..." : "Kaydet"}
            </Button>
          ) : (
            <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
              Fotoğraf Seç
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UploadPhotoForm;
