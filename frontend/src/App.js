import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/profilePage";
import { PhotoProvider } from "./contexts/PhotoContext";
import FollowingPage from "./pages/FollowingPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (

     <PhotoProvider>
      <BrowserRouter>
      <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element ={<HomePage/>}/>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} /> 
              </Route>
          <Route path="main" element={<MainPage />}></Route>
          <Route path="profile" element={<ProfilePage/>} />
          <Route path="follow" element={<FollowingPage/>}/>
          <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
    </PhotoProvider>
    
  );
}

export default App;
