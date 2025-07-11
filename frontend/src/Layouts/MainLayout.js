import React from "react";
import { Outlet, Link } from "react-router-dom";
import "./MainLayout.css";




  function MainLayout() { // jsx kodları
  return (
    <div className="layout-container"
    style={{padding:"20px",fontFamily:"Arial"}}>
              <header className = "header"  style={{marginBottom:"20px"}}>
                  <h1>myPictures</h1>
                   <nav style={{display:"flex", gap:"5px",}}>
                       <Link to= "/login">Giriş</Link>
                       <Link to = "/register">kayıt</Link>
            
                    </nav>
                </header>

                <main>
                  <Outlet/>

                </main>

                <footer style={{marginTop: "40px",fontSize:"10px",color:"#888"}}>
                    <p>alt kısım bilgileri</p>
                </footer>
    </div>
  )
}

export default MainLayout;