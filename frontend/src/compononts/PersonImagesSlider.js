import React, { useEffect, useState } from "react";
import "./PersonImagesSlider.css";

export default function PersonImagesSlider({
  userId,
  isActive,
  showProfilePhoto,
  profilePhotoUrl,
  username,
}) {

  //State değişkenleri 
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const THUMBNAIL_VISIBLE_COUNT = 5;

  const [isLiked,setIsLiked]=useState(false);
  const [likeCount,setLikeCount] =useState(0);
  const [isFollowing,setIsFollowing]=useState(false);


  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/pictures?userId=${userId}&limit=20`)
      .then((res) => res.json())
      .then((data) => {
        const urls = data.map((pic) => `http://localhost:5000${pic.imagePath}`);
        setImages(urls);
        setCurrentIndex(0);
        setThumbnailStartIndex(0);
      })
      .catch((err) => console.error("Fotoğraflar alınamadı", err));
  }, [userId]);


  

  const thumbnailNext = () => {
    if (thumbnailStartIndex + THUMBNAIL_VISIBLE_COUNT < images.length)
      setThumbnailStartIndex(thumbnailStartIndex + 1);
  };

  const thumbnailPrev = () => {
    if (thumbnailStartIndex > 0) setThumbnailStartIndex(thumbnailStartIndex - 1);
  };

  if (!images.length)
    return (
      <div className="no-images">
        <p>Fotoğraf bulunamadı</p>
      </div>
    );

  if (!isActive) {
    const firstImage = images[0] 
    const lastImage = images[images.length - 1]; // son foto gösterimi için 
    return (
      <div className="side-single-image-wrapper" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", marginTop: 8 }}>
                <img
                  className="slider-image-person inactive"
                  src={firstImage}
                  alt="İlk Fotoğraf"
                  style={{ width: "280px", height: "280px", objectFit: "cover", borderRadius: "10px" }}
                  draggable={false} // sürükleme işlemini engeller
                />
                {showProfilePhoto && profilePhotoUrl && (
                  <img className="user-profile-small" src={profilePhotoUrl} alt="Profil" />
                )}
                {username && (
                  <p style={{ fontWeight: "bold", fontSize: 14, color: "#333", textAlign: "center", wordBreak: "break-word" }}>
                    {username}
                  </p>
                )}
      </div>
    );
  }

  return (
    <div className="slider-wrapper-person">
        <div className="slider-container-person active">
                  <img
                    className="slider-image-person active"
                    src={images[currentIndex]}
                    alt={`img-${currentIndex}`}
                    style={{ width: "100%", height: "100%"}}
                    draggable={false}
                  />
                  


                {/* Beğeni ve Takip butonları - RESMİN ÜZERİNDE */}
                              <div className="like-button-wrapper">
                                  <button
                                    className={`like-button ${isLiked ? "liked" : ""}`}
                                    onClick={() => {
                                      setIsLiked(!isLiked);
                                      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
                                    }}
                                  >
                                    {isLiked ? "❤️" : "🤍"} {likeCount}
                                  </button>
                                </div>

                                <div className="follow-button-wrapper">
                                  <button
                                    className={`follow-button ${isFollowing ? "following" : ""}`}
                                    onClick={() => setIsFollowing(!isFollowing)}
                                  >
                                    {isFollowing ? "Takibi Bırak" : "Takip Et"}
                                  </button>
                                </div>






                  {/* Thumbnail Wrapper dış oklarla birlikte */}
                  <div className="thumbnail-wrapper">
                    <button
                      className="thumbnail-arrow left"
                      onClick={thumbnailPrev}
                      disabled={thumbnailStartIndex === 0}
                      aria-label="Önceki"
                    >
                      &#8249;
                    </button>

                    <div className="thumbnail-container">
                      {images
                        .slice(thumbnailStartIndex, thumbnailStartIndex + THUMBNAIL_VISIBLE_COUNT)
                        .map((img, i) => {
                          const realIndex = thumbnailStartIndex + i;
                          return (
                            <img
                              key={realIndex}
                              src={img}
                              alt={`thumb-${realIndex}`}
                              draggable={false}
                              onClick={() => setCurrentIndex(realIndex)}
                              className={realIndex === currentIndex ? "thumbnail-image selected" : "thumbnail-image"}
                            />
                          );
                        })}
                    </div>

                    <button
                      className="thumbnail-arrow right"
                      onClick={thumbnailNext}
                      disabled={thumbnailStartIndex + THUMBNAIL_VISIBLE_COUNT >= images.length}
                      aria-label="Sonraki"
                    >
                      &#8250;
                    </button>
                  </div>
        </div>

        {username && (
          <p style={{ fontWeight: "bold", fontSize: 16, color: "#222", marginTop: 8, textAlign: "center" }}>
            {username}
          </p>
        )}
    </div>
  );
}
