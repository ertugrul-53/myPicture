import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Stack from "react-bootstrap/Stack";
import { BsPersonCircle } from "react-icons/bs";
import "./MainPage.css";
import { useEffect, useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import PersonImagesSlider from "../compononts/PersonImagesSlider";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

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

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const prevUser = () => {
    setActiveIndex((old) => (old === 0 ? users.length - 1 : old - 1));
  };
  const nextUser = () => {
    setActiveIndex((old) => (old === users.length - 1 ? 0 : old + 1));
  };



// hangi sayfada olduğumuzu belirleyen fonsyon 
function TopBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="TopBar-buttons">
      <button
        className={`TopBar-button ${currentPath === "/main" ? "active" : ""}`}
      >
        MainPage
      </button>

      <button
        className={`TopBar-button ${currentPath === "/follow" ? "active" : ""}`}
      >
        Follow
      </button>
    </div>
  );
}

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
      <Stack direction="horizontal" gap={3}>


        <div className="p-2 ">
          <Link to="/main" style={{ textDecoration: "none", color: "black" }}>
            <h1>myPictures</h1>
          </Link>
        </div>

        <div className="TopBar-buttons" >
              <NavLink to="/main" className="TopBar-button">
                MainPage
              </NavLink>
              <NavLink to="/follow" className="TopBar-button">
                Follow
              </NavLink> 
        </div>

        <div className="ms-auto ">
          <div onClick={handleShow}>
            <BsPersonCircle size={40} color="black" />
          </div>

          <Offcanvas show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header>
              <Offcanvas.Title>myPictures</Offcanvas.Title>
            </Offcanvas.Header>
           
            <Offcanvas.Body>
              <div className="offcanvas-container">
                <Link className="hesabım" to="/profile">
                  Hesabım
                </Link>
                <br />
                <Link className="ayarlar">Ayarlar</Link>
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
                    profilePhotoUrl="images/logo.png"
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
                  height: "480px",
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
                    profilePhotoUrl="images/logo.png"
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
              src="images/logo.png"
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
