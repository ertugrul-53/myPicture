import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';




function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate =useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Giriş bilgileri:", email, password);
    try {
    const response = await fetch("http://localhost:5000/api/login", {  
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      
      localStorage.setItem("token",data.token);
      console.log(data);
      localStorage.setItem("username",data.username);
      navigate("/main");
    } else {
      alert("Hata: " + data.message);   
    }
  } catch (error) {
    alert("Sunucuya ulaşılamadı!");
  }
  };

  return (
  <div className="login-page">
    <div className="login-box">
      <h2 className="text-center mb-4">Giriş Yap</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email Adresi</Form.Label>
          <Form.Control
            type="email"
            placeholder="E-postanızı girin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Şifre</Form.Label>
          <Form.Control
            type="password"
            placeholder="Şifrenizi girin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <div className="d-grid">
          <Button variant="light" type="submit">
            Giriş Yap
          </Button>
        </div>
      </Form>
    </div>
  </div>
);

}


export default LoginPage;
