import {useState} from "react";
import { Outlet, Link } from "react-router-dom";

import Stack from "react-bootstrap/Stack";
import { FormControl } from "react-bootstrap";
import "./MainLayout.css";








  function MainLayout() { 
   

  return (
<div className="layout-container" style={{padding:"20px",
                                          fontFamily:"Arial",
                                          backgroundImage:"url('/images/br-Grey6.jpg')",
                                          backgroundSize:"cover",
                                          backgroundRepeat: "no-repeat",
                                          backgroundPosition: "center",
                                          minHeight: "100vh",
                                          padding: "20px",
                                          fontFamily: "Arial"}}>
                       
  <Stack direction="horizontal" gap={3}>
                          
              <div className="p-2">
                  <Link  to ="/" style={{textDecoration:"none",color:"black"}}>
                      <h1>myPictures</h1>
                  </Link>
              </div>
              <div id ="searchBox">
                  <FormControl  type="text"
                        placeholder="Ara"
                        style={{maxWidth:"300px",margin:"0 auto",position:"static"}}/>
              </div>
                               

      
      <div className="ms-auto d-flex">
          <div className="p-2">
           <Link to="/login" style={{ textDecoration: "none", color: "black" }}>
               Giriş
            </Link>
     </div>

    <div className="p-2">
         <Link to="/register" style={{ textDecoration: "none", color: "black" }}>
             Kayıt
       </Link>
   </div>
    </div>


            
                              
  </Stack>
                       
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