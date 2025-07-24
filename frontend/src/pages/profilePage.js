import React, { useState, useEffect } from "react";
import { Stack, Offcanvas, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import UploadPhotoForm from "../compononts/UploadPhotoForm.js";
import "./profilePage.css";

function ProfilePage() {
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Kullanıcı verisi çekme
  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Kullanıcı verisi alınamadı");

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Veri alma hatası:", error.message);
    }
  };

  // Kullanıcının fotoğraflarını çekme
  const fetchPhotos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/profile/photos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Fotoğraflar alınamadı");

      const photosData = await response.json();
      setPhotos(photosData);
    } catch (error) {
      console.error("Fotoğraf alma hatası:", error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchPhotos();
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fotoğraf silme fonksiyonu
  const handleDelete = async (photoId) => {
    if (!window.confirm("Bu fotoğrafı silmek istediğinize emin misiniz?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/delete-photo/${photoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Silme işlemi başarısız");

      // Silme başarılı, fotoğraf listesini güncelle
      setPhotos((prevPhotos) => prevPhotos.filter((p) => p._id !== photoId));
    } catch (error) {
      console.error("Fotoğraf silme hatası:", error);
      alert("Fotoğraf silme işlemi başarısız.");
    }
  };

  return (
    <div
      className="layout-container"
      style={{
        padding: "20px",
        fontFamily: "Arial",
        backgroundImage: "url('/images/backround.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {/* Üst Menü */}
      <Stack direction="horizontal" gap={3}>
        <div className="p-2">
          <Link to="/main" style={{ textDecoration: "none", color: "black" }}>
            <h1>{userData?.username}</h1>
          </Link>
        </div>

        <div className="ms-auto">
          <div onClick={handleShow} style={{ cursor: "pointer" }}>
            <BsPersonCircle size={40} color="black" />
          </div>

          <Offcanvas show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>myPictures</Offcanvas.Title>
            </Offcanvas.Header>
            <hr />
            <Offcanvas.Body>
              <div className="offcanvas-container">
                <Link className="hesabım" to="/profile">
                  Hesabım
                </Link>
                <br />
                <Link className="ayarlar" to="#">
                  Ayarlar
                </Link>
                <br />
                <Button variant="danger" onClick={handleLogout}>
                  Çıkış Yap
                </Button>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </Stack>

      {/* Fotoğraf Yükleme Bileşeni */}
      <UploadPhotoForm onUploadSuccess={fetchPhotos} userId={userData?._id} />

      {/* Fotoğraflar */}
      <div style={{ marginTop: "20px" }}>
        <h2>Paylaşılan Fotoğraflar</h2>
        {photos.length === 0 ? (
          <p>Henüz fotoğraf yok.</p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {photos.map((photo) => (
              <div key={photo._id} style={{ position: "relative" }}>
                <img
                  src={`http://localhost:5000${photo.imagePath}`}
                  alt="User photo"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <button
                  onClick={() => handleDelete(photo._id)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    backgroundColor: "rgba(5, 2, 2, 0.7)",
                    border: "none",
                    color: "white",
                    borderRadius: "50%",
                    width: "25px",
                    height: "25px",
                    cursor: "pointer",
                  }}
                  title="Fotoğrafı sil"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
