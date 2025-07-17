
import { useNavigate } from "react-router-dom";
import { Link,   } from 'react-router-dom';
import Stack from "react-bootstrap/Stack";
import { BsBox, BsPersonCircle } from "react-icons/bs";
import  './MainPage.css';
import { useEffect } from "react";
import { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import PersonImagesSlider from "../compononts/PersonImagesSlider";






  export default function MainPage (){

      const navigate = useNavigate();
      useEffect(()=>{
          const token =localStorage.getItem("token");
              if(!token){
              alert("token yok ");
              navigate("/login");
          }
         },[]);

      const handleLogout  =()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setShow(false);
        navigate("/login");
      }

      //ofcanvass
          const[show,setShow]=useState(false);
          const handleClose=()=>  setShow(false);
          const handleShow=()=>setShow(true);
  

    
  return (
    <div className="layout-container" style={{padding:"20px",
                                          fontFamily:"Arial",
                                          backgroundImage:"url('/images/backround.jpg')",
                                          backgroundSize:"cover",
                                          backgroundRepeat: "no-repeat",
                                          backgroundPosition: "center",
                                          minHeight: "100vh",
                                          padding: "20px",
                                          fontFamily: "Arial"}}>
                       
  <Stack direction="horizontal" gap={3}>
                          
              <div className="p-2 ">
                  <Link  to ="/" style={{textDecoration:"none",color:"black"}}>
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
                <Offcanvas.Body>
                  <Button variant="danger" onClick={handleLogout}>Çıkış Yap</Button>

                </Offcanvas.Body>
               </Offcanvas>
            </div>
  </Stack>
                       
      
       
  <div className="mainPage">
      <PersonImagesSlider></PersonImagesSlider>
      <PersonImagesSlider></PersonImagesSlider>
      <PersonImagesSlider></PersonImagesSlider>

    </div>      
    
    
    
    
    
    
<footer style={{marginTop: "40px",fontSize:"10px",color:"#888"}}>
        <p>alt kısım bilgileri</p>
</footer>
</div>
  )
}

