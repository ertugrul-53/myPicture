import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./RegisterPage.css"; 

function RegisterPage() {
  const [username, setUsername] = useState(""); // kullanıcı adı state'i
  const [email, setEmail] = useState(""); // email state'i
  const [password, setPassword] = useState(""); // şifre state'i

  const handleRegister = async (e) => {
    e.preventDefault(); // sayfa yenilenmesini engeller
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST", // sunucuya veri gönder
        headers: {
          "Content-Type": "application/json", // gönderilen veri tipi
        },
        body: JSON.stringify({ username, email, password }), // veriyi string'e çevir
      });

      const data = await response.json(); // gelen cevabı çözümle

      if (response.ok) {
        alert("Kayıt başarılı ");
      } else {
        alert("Hata: " + data.message); // örneğin "email zaten kullanılıyor"
      }
    } catch (error) {
      alert("Sunucuya ulaşılamadı ");
      console.error(error);
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2 className="text-center mb-4">Kayıt Ol</h2>
        <Form onSubmit={handleRegister}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Kullanıcı Adı</Form.Label>
            <Form.Control
              type="text"
              placeholder="Adınızı girin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email adresi"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Şifre</Form.Label>
            <Form.Control
              type="password"
              placeholder="Şifre girin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid">
            <Button variant="light" type="submit">
              Kayıt Ol
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
