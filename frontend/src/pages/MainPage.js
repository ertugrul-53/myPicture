import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Stack from "react-bootstrap/Stack";
import { BsPersonCircle } from "react-icons/bs";
import "./MainPage.css";
import { useEffect, useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import PersonImagesSlider from "../compononts/PersonImagesSlider";

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

        <div className="ms-auto ">
          <div onClick={handleShow}>
            <BsPersonCircle size={40} color="black" />
          </div>

          <Offcanvas show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header>
              <Offcanvas.Title>myPictures</Offcanvas.Title>
            </Offcanvas.Header>
            <hr />
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
            gap: "150px",
            width: "100%",
          }}
        >
          <Button variant="secondary" onClick={prevUser}>
            &#8249;
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
                  />
                  <p>{users[activeIndex - 1].username}</p>
                </div>
              ) : (
                <div className="user-preview" />
              )}

              {/* Ortadaki aktif kullanıcı slider */}
              <div
                className="user-active"
                style={{
                  width: "600px",
                  height: "400px",
                  padding: "0",
                  border: "2px solid #444",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <PersonImagesSlider
                  userId={users[activeIndex]._id}
                  isActive={true}
                />
              </div>

              {/* Sağ kullanıcı slider */}
              {activeIndex < users.length - 1 ? (
                <div className="user-preview">
                  <PersonImagesSlider
                    userId={users[activeIndex + 1]._id}
                    isActive={false}
                    showProfilePhoto={true}
                    profilePhotoUrl="images/logo.png"
                  />
                  <p>{users[activeIndex + 1].username}</p>
                </div>
              ) : (
                <div className="user-preview" />
              )}
            </>
          )}

          <Button variant="secondary" onClick={nextUser}>
            &#8250;
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
