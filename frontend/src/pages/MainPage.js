import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Stack from "react-bootstrap/Stack";
import { BsPersonCircle } from "react-icons/bs";
import './MainPage.css';
import { useEffect, useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import PersonImagesSlider from "../compononts/PersonImagesSlider";  // Dizin doğru mu kontrol et

export default function MainPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);  // Kullanıcıları tutacak state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("token yok ");
      navigate("/login");
      return;
    }

    // Kullanıcı listesini backend'den çek
    fetch("http://localhost:5000/api/users?limit=8") // kendi backend endpoint'in
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Kullanıcılar alınamadı", err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShow(false);
    navigate("/login");
  };

  // Offcanvas kontrolü
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="layout-container" style={{
      padding: "20px",
      fontFamily: "Arial",
      backgroundImage: "url('/images/backround.jpg')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      minHeight: "100vh",
    }}>
      <Stack direction="horizontal" gap={3}>
        <div className="p-2 ">
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            <h1>myPictures</h1>
          </Link>
        </div>

        <div className="ms-auto ">
          <div onClick={handleShow}>
            <BsPersonCircle size={40} color="black" />
          </div>

          <Offcanvas show={show} onHide={handleClose} placement="end" >
            <Offcanvas.Header>
              <Offcanvas.Title>myPictures</Offcanvas.Title>
            </Offcanvas.Header>
            <hr />
            <Offcanvas.Body>
              <div className="offcanvas-container">
                <Link className="hesabım">Hesabım</Link><br />
                <Link className="ayarlar">Ayarlar</Link><br />
                <Button variant="danger" onClick={handleLogout}>Çıkış Yap</Button>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </Stack>

      <div className="mainPage" style={{ marginTop: "20px" }}>
        {/* Kullanıcılar geldikçe slider bileşenlerini render et */}
        {users.map(user => (
          <PersonImagesSlider
            key={user._id}
            userId={user._id}
            username={user.username}
          />
        ))}
      </div>

      <footer style={{ marginTop: "40px", fontSize: "10px", color: "#888" }}>
        <p>alt kısım bilgileri</p>
      </footer>
    </div>
  )
}
