import React, { useEffect, useState } from "react";
import "./PersonImagesSlider.css";

export default function PersonImagesSlider({ userId, isActive, showProfilePhoto, profilePhotoUrl }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5000/api/pictures?userId=${userId}&limit=20`)
      .then((res) => res.json())
      .then((data) => {
        const urls = data.map((pic) => `http://localhost:5000${pic.imagePath}`);
        setImages(urls);
        setCurrentIndex(0);
      })
      .catch((err) => console.error("Fotoğraflar alınamadı", err));
  }, [userId]);

  const scrollLeft = () => {
    setCurrentIndex((old) => (old === 0 ? images.length - 1 : old - 1));
  };

  const scrollRight = () => {
    setCurrentIndex((old) => (old === images.length - 1 ? 0 : old + 1));
  };

  if (!images.length)
    return (
      <div className="no-images">
        <p>Fotoğraf bulunamadı</p>
      </div>
    );

  return (
    <div className="slider-wrapper-person" style={{ width: "100%", height: "100%" }}>
      {/* Profil fotoğrafı yan kullanıcılar için */}
      {showProfilePhoto && (
        <img
          className="user-profile-small"
          src={profilePhotoUrl}
          alt="Profil"
          style={{ borderRadius: "50%", width: 40, height: 40, marginBottom: 8 }}
        />
      )}

      {isActive && (
        <button className="arrow left" onClick={scrollLeft}>
          &#8249;
        </button>
      )}

      <div className={`slider-container-person ${isActive ? "active" : "inactive"}`}>
        {isActive ? (
          <img
            className="slider-image-person active"
            src={images[currentIndex]}
            alt={`img-${currentIndex}`}
          />
        ) : (
          images.slice(0, 3).map((src, index) => (
            <img
              className="slider-image-person inactive"
              key={index}
              src={src}
              alt={`img-${index}`}
            />
          ))
        )}
      </div>

      {isActive && (
        <button className="arrow right" onClick={scrollRight}>
          &#8250;
        </button>
      )}
    </div>
  );
}
