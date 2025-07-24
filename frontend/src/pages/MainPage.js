import React, { useEffect, useState } from "react";
import PersonImagesSlider from "../compononts/PersonImagesSlider";
import { Button, Offcanvas, Stack } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [skip, setSkip] = useState(0);
  const limit = 5;
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  // Yeni: kullanıcı fotoğraflarını saklamak için state
  const [userPhotos, setUserPhotos] = useState({}); // { userId: [photos] }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("token yok ");
      navigate("/login");
      return;
    }
    fetchUsers(0);
  }, [navigate]);

  // Kullanıcıların fotoğraflarını çek ve state güncelle
  const fetchPhotosByUser = (userId) => {
    fetch(`http://localhost:5000/api/pictures?userId=${userId}&limit=10`)
      .then(res => res.json())
      .then(data => {
        setUserPhotos(prev => ({ ...prev, [userId]: data }));
      })
      .catch(err => console.error("Fotoğraflar alınamadı", err));
  };

  // Kullanıcıları çek ve fotoğrafları da çek
  const fetchUsers = (skipCount) => {
    setLoading(true);

    fetch(`http://localhost:5000/api/users?limit=${limit}&skip=${skipCount}`)
      .then(res => res.json())
      .then(data => {
        if (skipCount === 0) {
          setUsers(data);
        } else {
          setUsers(prevUsers => [...prevUsers, ...data]);
        }
        setSkip(skipCount + data.length);

        // Her kullanıcı için fotoğrafları çek
        data.forEach(user => fetchPhotosByUser(user._id));
      })
      .catch(err => console.error("Kullanıcılar alınamadı", err))
      .finally(() => setLoading(false));
  };

  // Upload sonrası MainPage’de fotoğrafları güncellemek için
  const handlePhotoUploadSuccess = (userId) => {
    fetchPhotosByUser(userId);
  };

  // Logout ve Offcanvas kodu aynen kalacak...

  return (
    <div className="layout-container" style={{ padding: "20px", fontFamily: "Arial", backgroundImage: "url('/images/backround.jpg')", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center", minHeight: "100vh" }}>
      <Stack direction="horizontal" gap={3}>
        <div className="p-2 ">
          <Link to="/main" style={{ textDecoration: "none", color: "black" }}>
            <h1>myPictures</h1>
          </Link>
        </div>
        <div className="ms-auto ">
          <div onClick={() => setShow(true)}>
            <BsPersonCircle size={40} color="black" />
          </div>
          <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
            <Offcanvas.Header>
              <Offcanvas.Title>myPictures</Offcanvas.Title>
            </Offcanvas.Header>
            <hr />
            <Offcanvas.Body>
              <div className="offcanvas-container">
                <Link className="hesabım" to="/profile">Hesabım</Link><br />
                <Link className="ayarlar">Ayarlar</Link><br />
                <Button variant="danger" onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  setShow(false);
                  navigate("/login");
                }}>Çıkış Yap</Button>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </Stack>

      <div className="mainPage" style={{ marginTop: "20px" }}>
        {/* Kullanıcılar geldikçe sliderları render et, fotosunu userPhotos’dan ver */}
        {users.map(user => (
          <PersonImagesSlider
            key={user._id}
            userId={user._id}
            username={user.username}
            images={userPhotos[user._id] || []} // Burada fotoğraflar gönderiliyor
          />
        ))}

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button onClick={() => fetchUsers(skip)} disabled={loading}>
            {loading ? "Yükleniyor..." : "Daha Fazla Kullanıcı Yükle ↓"}
          </Button>
        </div>
      </div>

      <footer style={{ marginTop: "40px", fontSize: "10px", color: "#888" }}>
        <p>alt kısım bilgileri</p>
      </footer>
    </div>
  );
}
