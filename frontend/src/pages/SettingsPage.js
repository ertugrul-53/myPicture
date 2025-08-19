import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Offcanvas, Stack, Button } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import "./SettingsPage.css";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    profilePhotoUrl: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState("");

  const token = localStorage.getItem("token");

  // Kullanıcı bilgilerini çek
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchMe = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Yetkisiz veya hata");
        const data = await res.json();
        setForm({
          username: data.username || "",
          email: data.email || "",
          password: "",
          profilePhotoUrl: data.profilePhotoUrl || "",
        });
      } catch (e) {
        console.error(e);
        alert("Kullanıcı bilgileri alınamadı.");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShow(false);
    navigate("/login");
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Profil resmi yükleme
  const onSelectFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Önizleme
    const url = URL.createObjectURL(file);
    setPreview(url);

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload/profile", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // Content-Type ekleme
        body: fd,
      });

      if (!res.ok) throw new Error("Yükleme hatası");

      const data = await res.json();
      if (!data.imagePath) throw new Error("Sunucu resim yolu göndermedi");

      setForm((f) => ({ ...f, profilePhotoUrl: data.imagePath }));
    } catch (err) {
      console.error(err);
     
    }
  };

  // Bilgileri kaydet
  const onSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Güncelleme hatası");

      alert("Bilgiler güncellendi.");
      setForm((f) => ({ ...f, password: "" }));
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="settings-loading">Yükleniyor…</div>;

  return (
    <div
      className="layout-container"
      style={{
        padding: "0px",
        fontFamily: "Arial",
        backgroundImage: "url('/images/br-Grey6.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Stack className="topbar" direction="horizontal" gap={3}>
        <div className="p-2">
          <Link className="myPicture" to="/main" style={{ textDecoration: "none", color: "black" }}>myPictures</Link>
        </div>

        <div className="ms-auto">
          <div onClick={() => setShow(true)}>
            <BsPersonCircle size={55} color="black" />
          </div>

          <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
            <Offcanvas.Header>
              <Offcanvas.Title>myPictures</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <div className="offcanvas-container">
                <Link className="hesabım" to="/profile">Hesabım</Link>
                <br />
                <Link className="ayarlar" to="/settings">Ayarlar</Link>
                <br />
                <Button variant="danger" onClick={handleLogout}>Çıkış Yap</Button>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </Stack>

      {/* Profil Ayar Kartı */}
      <div className="settings-card">
        <div className="settings-photo-area">
          <img
            src={
              preview
                ? preview
                : form.profilePhotoUrl
                ? `http://localhost:5000${form.profilePhotoUrl}`
                : "/images/logo.png"
            }
            alt="profil"
            className="settings-photo"
          />
          <label className="settings-upload-btn">
            Profil Resmi Seç
            <input type="file" accept="image/*" onChange={onSelectFile} hidden />
          </label>
        </div>

        <div className="settings-fields">
          <div className="settings-field">
            <label>Kullanıcı Adı</label>
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="Kullanıcı adı"
            />
          </div>

          <div className="settings-field">
            <label>E-posta</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="E-posta"
            />
          </div>

          <div className="settings-field">
            <label>Yeni Şifre</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="Yeni şifre"
            />
          </div>

          <div className="settings-actions">
            <Button disabled={saving} onClick={onSave}>
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
