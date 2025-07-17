import React from "react";
import "./ImageSlider2.css";
import { useRef } from "react";


const images = [
  "/images/img8.jpg",
  "/images/img2.jpg",
  "/images/img3.jpg",
  "/images/img4.jpg",
  "/images/img5.jpg",
  "/images/img6.jpg",
  "/images/img7.jpg",
  "/images/img1.jpg",
];


export function ImageSlider2(){
        const sliderRef =useRef(null);

        const scrollLeft = () => {
             sliderRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };
        const scrollRight = () => {
            sliderRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="slider-wrapper">
      

      <div className="slider-container" ref={sliderRef}>
        {images.map((src, index) => (
          <img key={index} src={src} alt={`img-${index}`} className="slider-image" />
        ))}
      </div>

      <button className="arrow right" onClick={scrollRight}>
        &#8250;
      </button>
    </div>
  );
}