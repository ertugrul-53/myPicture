import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/profilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element ={<HomePage/>}/>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} /> 
              </Route>
          <Route path="main" element={<MainPage />}></Route>
          <Route path="profile" element={<ProfilePage/>} />
          
      </Routes>
    </BrowserRouter>
  );
}

export default App;
