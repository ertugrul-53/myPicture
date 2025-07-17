import React from 'react'
import "./PersonImagesSlider.css";
import { useRef } from 'react';

const images = [
  "/images/img8.jpg",
  "/images/img2.jpg",
  "/images/img3.jpg",
  "/images/img4.jpg",
  "/images/img5.jpg",
  "/images/img6.jpg",
  "/images/img7.jpg",
  "/images/img1.jpg",
   "/images/img8.jpg",
  "/images/img2.jpg",
  "/images/img3.jpg",
  "/images/img4.jpg",
  "/images/img5.jpg",
  "/images/img6.jpg",
  "/images/img7.jpg",
  "/images/img1.jpg",   
];

export default function PersonImagesSlider() {
   const sliderRef = useRef(null);
  
   /* const scrollLeft = () => {
      sliderRef.current.scrollBy({ left: -200, behavior: "smooth" });
    };
  
    const scrollRight = () => {
      sliderRef.current.scrollBy({ left: 200, behavior: "smooth" });
    };*/
  return (
    <div>  <div className="slider-wrapper" >
      <div className="slider-profile">
        <img className="user-profile" src='images/logo.png' alt='boş' width={40} height={40 } />
        <h5>asdas</h5>
        


      </div>
      

      <div className="slider-container" ref={sliderRef} style={{overflowX:"auto" }} >
        {images.map((src, index) => (
 
          <img className="slider-image" key={index} src={src} alt={`img-${index}`}  />
          
         

        ))}
      </div>

    
    </div></div>
    
  )
}














