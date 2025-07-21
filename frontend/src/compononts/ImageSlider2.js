import React from "react";
import "./ImageSlider2.css";
import { useRef } from "react";





export function ImageSlider2({images}){
        const sliderRef =useRef(null);

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
       {images && images.length > 0 ? (
          images.map((src, index) => (
            <img key={index} src={src} alt={`img-${index}`} className="slider-image" />
          ))
        ) : (
          <p>Gösterilecek fotoğraf yok.</p>
        )}
      </div>

      <button className="arrow right" onClick={scrollRight}>
        &#8250;
      </button>
    </div>
  );
}