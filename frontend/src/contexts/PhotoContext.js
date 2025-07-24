import React, { createContext, useContext, useState, useEffect } from "react";

const PhotoContext = createContext();

export function PhotoProvider({ children }) {
  const [allUserPhotos, setAllUserPhotos] = useState({}); 
  // Örnek yapı: { userId1: [foto1, foto2], userId2: [foto1, foto2] }

  // Belirli bir kullanıcının fotoğraflarını getirip context'e eklemek için:
  const fetchPhotosByUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/pictures?userId=${userId}&limit=10`);
      const data = await res.json();
      setAllUserPhotos(prev => ({ ...prev, [userId]: data }));
    } catch (error) {
      console.error("Fotoğraflar alınamadı:", error);
    }
  };

  // Yeni bir fotoğraf yüklendiğinde ilgili kullanıcının fotoğraflarını güncellemek için:
  const addPhotoForUser = (userId, photo) => {
    setAllUserPhotos(prev => {
      const userPhotos = prev[userId] || [];
      return {
        ...prev,
        [userId]: [photo, ...userPhotos], // yeni fotoğrafı başa ekle
      };
    });
  };

  return (
    <PhotoContext.Provider value={{ allUserPhotos, fetchPhotosByUser, addPhotoForUser }}>
      {children}
    </PhotoContext.Provider>
  );
}

// Context hook'u kolay kullanım için:
export function usePhotoContext() {
  return useContext(PhotoContext);
}
