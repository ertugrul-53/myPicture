import { Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Offcanvas } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { useState } from "react";
import React from "react";
import { useEffect } from "react";


function ProfilePage() {
  const [show, setShow] = useState(false); // Offcanvas için state
   const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); // Çıkış sonrası yönlendirme için


useEffect(() => {
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    

    try {
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Token'ı başlığa ekliyoruz
        },
      });
      

      if (!response.ok) {
        throw new Error("Kullanıcı verisi alınamadı");
      }

      const data = await response.json();
      setUserData(data); // State'e veriyi yaz
    } catch (error) {
      console.error("Veri alma hatası:", error.message);
    }
  };
  

  fetchUserData();
}, []);

  

  

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Token'ı temizle
    navigate("/login"); // Login sayfasına yönlendir
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
    </div>
  );
}

export default ProfilePage;
