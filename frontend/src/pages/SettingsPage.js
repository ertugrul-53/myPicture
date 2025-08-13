import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Offcanvas, Stack, Button } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import "./SettingsPage.css";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const [selectedFile, setSelectedFile] = useState(null);

  const token = localStorage.getItem("token");

  // Kullanıcı bilgilerini çek
  const fetchUserData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Kullanıcı bilgisi alınamadı");
      const data = await res.json();
      setName(data.name);
      setEmail(data.email);
      if (data.profileImage) {
        setProfileImage(data.profileImage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Profil resmi değiştiğinde
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  // Kaydet
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (password) formData.append("password", password);
      if (selectedFile) formData.append("profileImage", selectedFile);

      const res = await fetch("http://localhost:5000/api/user/update", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        alert("Bilgiler kaydedildi!");
        fetchUserData();
      } else {
        alert(data.message || "Güncelleme başarısız");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShow(false);
    navigate("/login");
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div
      className="layout-container"
      style={{
        padding: "20px",
        fontFamily: "Arial",
        backgroundImage: "url('/images/br-Grey6.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {/* Üst Bar */}
      <Stack direction="horizontal" gap={3}>
        <div className="p-2">
          <Link
            className="settings-logo"
            to="/main"
            style={{ textDecoration: "none", color: "black" }}
          >
            myPicture
          </Link>
        </div>

        <div className="ms-auto ">
          <div onClick={handleShow}>
            <BsPersonCircle size={40} color="black" />
          </div>

          <Offcanvas show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header>
              <Offcanvas.Title>myPicture</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="offcanvas-container">
                <Link className="hesabım" to="/profile">
                  Hesabım
                </Link>
                <br />
                <Link className="ayarlar" to="/settings">
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

      {/* Ayarlar Kartı */}
      <div className="settings-container">
        <div className="settings-card">
          {/* Profil Resmi */}
          <div className="profile-image-wrapper">
            <img src={profileImage} alt="Profil" className="profile-image" />
            <input
              type="file"
              accept="image/*"
              id="profile-upload"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <label htmlFor="profile-upload" className="change-photo-btn">
              Fotoğrafı Değiştir
            </label>
          </div>

          {/* Bilgi Formu */}
          <div className="settings-form">
            <label>İsim</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />

            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />

            <label>Şifre</label>
            <input
              type="password"
              placeholder="Yeni şifre girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="save-btn" onClick={handleSave}>
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
