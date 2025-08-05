import React, { useState, useEffect } from "react";
import { Stack, Offcanvas, Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { BsPersonCircle } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import PersonImagesSlider from "../compononts/PersonImagesSlider";
import "./FollowingPage.css";
import ImageSlider from "../compononts/ImageSlider";
import FollowSlider from "../compononts/FollowSlider";

export default function FollowingPage() {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activTab,setActiveTab]=useState("following");


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const prevUser = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const nextUser = () => {
    setActiveIndex((prev) => Math.min(prev + 1, users.length - 1));
  };

  // Kullanıcıları API'den çek
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Kullanıcılar çekilemedi", err);
      }
    };

    fetchUsers();
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
      {/* TopBar */}
      <Stack direction="horizontal" gap={3}>
        <div className="p-2 ">
          <Link to="/main" style={{ textDecoration: "none", color: "black" }}>
            <h1>myPictures</h1>
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

              <div className="interaction-buttons">
             <button className="following" onClick={() => setActiveTab("following")}>Following</button>
            <button  className ="followers"onClick={() => setActiveTab("followers")}>Followers</button>
        </div>
        
        <FollowSlider activeTab={activTab} />

        
        

      

     
    </div>
  );
}
