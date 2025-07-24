import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import Stack from "react-bootstrap/Stack";
import { BsPersonCircle } from "react-icons/bs";
import './MainPage.css';
import { useEffect, useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import PersonImagesSlider from "../compononts/PersonImagesSlider";

export default function MainPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);        // Kullanıcılar listesi
  const [skip, setSkip] = useState(0);           // Kaç kullanıcı atlandı
  const limit = 5;                               // Her seferde kaç kullanıcı çekilecek
  const [loading, setLoading] = useState(false); // Yükleniyor durumu

  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("token yok ");
      navigate("/login");
      return;
    }

    // İlk kullanıcıları çek
    fetchUsers(0);
  }, [navigate]);

  // Kullanıcıları çekme fonksiyonu
  const fetchUsers = (skipCount) => {
    setLoading(true);

    fetch(`http://localhost:5000/api/users?limit=${limit}&skip=${skipCount}`)
      .then(res => res.json())
      .then(data => {

        if (skipCount === 0) {
          setUsers(data);  // İlk çekmede direkt set et
        } else {
          setUsers(prevUsers => [...prevUsers, ...data]); // Sonrakilerde listeye ekle
        }
        setSkip(skipCount + data.length);
      })
      .catch(err => console.error("Kullanıcılar alınamadı", err))
      .finally(() => setLoading(false));
  };

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

  // Daha fazla kullanıcı yükle butonuna basınca
  const loadMoreUsers = () => {
   
    fetchUsers(skip);
  };

  return (
    <div className="layout-container" style={{
      padding: "20px",
      fontFamily: "Arial",
      backgroundImage: "url('/images/br4.jpg')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      minHeight: "100vh",
    }}>
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

          <Offcanvas show={show} onHide={handleClose} placement="end" >
            <Offcanvas.Header>
              <Offcanvas.Title>myPictures</Offcanvas.Title>
            </Offcanvas.Header>
            <hr />
            <Offcanvas.Body>
              <div className="offcanvas-container">
                <Link className="hesabım" to ="/profile">Hesabım</Link><br />
                <Link className="ayarlar">Ayarlar</Link><br />
                <Button variant="danger" onClick={handleLogout}>Çıkış Yap</Button>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </Stack>

      <div className="mainPage" style={{ marginTop: "20px" }}>
        {/* Kullanıcılar geldikçe slider bileşenlerini render etme */}
        {users.map(user => (
          <PersonImagesSlider
            key={user._id}
            userId={user._id}
            username={user.username}
          />
        ))}

        {/* Yükle butonu - yükleniyor ise buton disable */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button onClick={loadMoreUsers} disabled={loading}>
            {loading ? "Yükleniyor..." : "Daha Fazla Kullanıcı Yükle ↓"}
          </Button>
        </div>
      </div>

      <footer style={{ marginTop: "40px", fontSize: "10px", color: "#888" }}>
        <p>alt kısım bilgileri</p>
      </footer>
    </div>
  )
}
