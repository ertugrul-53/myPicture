import React, { useEffect, useState } from "react";
import "./MainPage.css";
import { useNavigate, Link, NavLink, useLocation } from "react-router-dom";
import Stack from "react-bootstrap/Stack";
import { BsPersonCircle } from "react-icons/bs";
import { Button, Offcanvas } from "react-bootstrap";
import PersonImagesSlider from "../compononts/PersonImagesSlider";
import { motion, AnimatePresence } from "framer-motion";
import {jwtDecode} from "jwt-decode";


export default function MainPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const limit = 10;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("token yok");
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5000/api/users?limit=${limit}`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Kullanıcılar alınamadı", err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShow(false);
    navigate("/login");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const prevUser = () => {
    setActiveIndex((old) => (old === 0 ? users.length - 1 : old - 1));
  };
  const nextUser = () => {
    setActiveIndex((old) => (old === users.length - 1 ? 0 : old + 1));
  };

  // Token decode ederek userId'ye erişme
  const token = localStorage.getItem("token");

  let currentUserId = null;
  if (token) {
    const decode = jwtDecode(token);
    currentUserId = decode.userId;
  }

  // Takip durumu kontrolü
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUserId || users.length === 0) return;

      const targetUserId = users[activeIndex]._id;
      if (currentUserId === targetUserId) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/follow/status?followerID=${currentUserId}&followingId=${targetUserId}`
        );
        const data = await res.json();
        setIsFollowing(data.isFollowing);
      } catch (error) {
        console.error("Takip durumu alınamadı", error);
      }
    };

    checkFollowStatus();
  }, [activeIndex, users, currentUserId]);

  // Takip / takibi bırak fonksiyonu
  const handleFollowToggle = async () => {
    const targetUserId = users[activeIndex]._id;
    const endpoint = isFollowing
      ? "http://localhost:5000/api/follow/unfollow"
      : "http://localhost:5000/api/follow";

    try {
       const token = localStorage.getItem("token");
           if (!token) {
  console.warn("Kullanıcı giriş yapmamış. Token yok.");
  return;
}
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          followerID: currentUserId,
          followingId: targetUserId,
        }),
      });

      const data = await res.json();
      console.log(data.message);
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Takip isteği hatası:", err);
    }
  


  };

  function TopBar() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
      <div className="TopBar-buttons">
        <button className={`TopBar-button ${currentPath === "/main" ? "active" : ""}`}>
          MainPage
        </button>

        <button className={`TopBar-button ${currentPath === "/follow" ? "active" : ""}`}>
          Follow
        </button>
      </div>
    );
  }

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


      <Stack  className ="topbar"direction="horizontal" gap={3}>
        <div className="p-2 ">
          <Link to="/main" style={{ textDecoration: "none", color: "black" }}>
            <h1 className="myPicture">myPictures</h1>
          </Link>
        </div>

        <div className="TopBar-buttons">
          <NavLink to="/main" className="TopBar-button">
            MainPage
          </NavLink>
          <NavLink to="/follow" className="TopBar-button">
            Follow
          </NavLink>
        </div>

        <div className="ms-auto">
          <div onClick={handleShow} style={{ cursor: "pointer" }}>
            {users.length > 0 && currentUserId ? (
              // Kullanıcının kendi profil fotoğrafı varsa göster
              <img
                src={
                  users.find((u) => u._id === currentUserId)?.profilePhotoUrl
                    ? `http://localhost:5000${users.find((u) => u._id === currentUserId).profilePhotoUrl}`
                    : "/images/logo.png" // varsayılan foto
                }
                alt="Profil Fotoğrafı"
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  boxShadow : "0 2px 8px"
                  
                }}
              />
            ) : (
              // Eğer kullanıcı yoksa icon göster
              <BsPersonCircle size={40} color="black" />
            )}
          </div>

          <Offcanvas show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>myPictures</Offcanvas.Title>
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




      <div
        className="user-carousel-container"
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "90px",
            width: "100%",
          }}
        >
          {/* Sol buton */}
          <Button variant="secondary" onClick={prevUser}>
            &#10094;
          </Button>

          {users.length > 0 && (
            <>
             
            {/* Sol kullanıcı slider */}
            {activeIndex > 0 ? (
              <div className="user-preview">
                <PersonImagesSlider
                  userId={users[activeIndex - 1]._id}
                  isActive={false}
                  showProfilePhoto={true}
                  profilePhotoUrl={
                    users[activeIndex - 1].profilePhotoUrl
                      ? `http://localhost:5000${users[activeIndex - 1].profilePhotoUrl}`
                      : "/images/logo.png"
                  }
                  username={users[activeIndex - 1].username}
                />
              </div>
            ) : (
              <div className="user-preview" />
            )}

            {/* Ortadaki aktif kullanıcı slider */}
            <div
              className="user-active"
              style={{
                width: "1300px",
                height: "450px",
                padding: "0",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={users[activeIndex]._id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  <PersonImagesSlider
                    userId={users[activeIndex]._id}
                    isActive={true}
                    showProfilePhoto={true}
                    profilePhotoUrl={
                      users[activeIndex].profilePhotoUrl
                        ? `http://localhost:5000${users[activeIndex].profilePhotoUrl}`
                        : "/images/logo.png"
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sağ kullanıcı slider */}
            {activeIndex < users.length - 1 ? (
              <div className="user-preview">
                <PersonImagesSlider
                  userId={users[activeIndex + 1]._id}
                  isActive={false}
                  showProfilePhoto={true}
                  profilePhotoUrl={
                    users[activeIndex + 1].profilePhotoUrl
                      ? `http://localhost:5000${users[activeIndex + 1].profilePhotoUrl}`
                      : "/images/logo.png"
                  }
                  username={users[activeIndex + 1].username}
                />
              </div>
            ) : (
              <div className="user-preview" />
            )}

            </>
          )}

          {/* Sağ buton */}
          <Button className="btn-secondary" variant="secondary" onClick={nextUser}>
            &#10095;
          </Button>
        </div>

        {/* Aktif kullanıcının profil bilgisi */}
        {users.length > 0 && (
          <div
            className="user-profile-info"
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={
    users[activeIndex].profilePhotoUrl
      ? `http://localhost:5000${users[activeIndex].profilePhotoUrl}`
      : "/images/logo.png"
  }
              alt="profil"
              width={50}
              height={50}
              style={{ borderRadius: "50%" }}
            />
            <p style={{ fontWeight: "bold" }}>{users[activeIndex].username}</p>
          </div>
        )}

        
      </div>
    </div>
  );
}
