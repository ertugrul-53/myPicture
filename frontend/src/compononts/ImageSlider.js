import React, { useRef } from "react";
import "./ImageSlider.css";

const images = [
  "/images/img1.jpg",
  "/images/img2.jpg",
  "/images/img3.jpg",
  "/images/img4.jpg",
  "/images/img5.jpg",
  "/images/img6.jpg",
  "/images/img7.jpg",
  "/images/img8.jpg",
  
];

function ImageSlider() {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="slider-wrapper">
      <button className="arrow left" onClick={scrollLeft}>
        &#8249;
      </button>

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

export default ImageSlider;
