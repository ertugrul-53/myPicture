import React, { useEffect, useState, useRef } from "react";
import "./PersonImagesSlider.css";

export default function PersonImagesSlider({ userId, username }) {
  const sliderRef = useRef(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/pictures?userId=${userId}&limit=20`)
      .then((res) => res.json())
      .then((data) => {
        const urls = data.map((pic) => `http://localhost:5000${pic.imagePath}`);

        setImages(urls);
      })
      .catch((err) => console.error("Fotoğraflar alınamadı", err));
  }, [userId]);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div className="slider-wrapper">
      <div className="slider-profile">
        <img className="user-profile" src="images/logo.png" alt="profil" width={40} height={40} />
        <h5>{username}</h5>
        
      </div>
      <button className="arrow left" onClick={scrollLeft}>
          &#8249;
        </button>

      <div className="slider-container" ref={sliderRef} style={{ overflowX: "auto" }}>
        {images.map((src, index) => (
          <img className="slider-image" key={index} src={src} alt={`img-${index}`} />
        ))}
      </div>

      <button className="arrow right" onClick={scrollRight}>
        &#8250;
      </button>
    </div>
  );
}
