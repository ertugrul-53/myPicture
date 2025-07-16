
import { useNavigate } from "react-router-dom";
import { Link,   } from 'react-router-dom';
import Stack from "react-bootstrap/Stack";
import { BsPersonCircle } from "react-icons/bs";
import  './ProfilePage.css';
import { useEffect } from "react";
import { useState } from "react";






  export default function ProfilePage (){

      const navigate = useNavigate();

      useEffect(()=>{
          const token =localStorage.getItem("token");
          
          if(!token){
              alert("token yok ");
              navigate("/login");
          }
          
          navigate("/main");
      },[]);

      const handleLogout  =()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
              
              <div className="logout"> <button onClick={handleLogout}>Çıkış Yap</button></div>               

      
            <div className="ms-auto ">
                <Link to={"/profile"} > 
                      <BsPersonCircle size={40} color='black'/>
                </Link>
            </div>
                             
           
                              
  </Stack>
                       
        <h1>asjdnlsdamşa</h1>
    <footer style={{marginTop: "40px",fontSize:"10px",color:"#888"}}>
        <p>alt kısım bilgileri</p>
    </footer>
</div>
  )
}

