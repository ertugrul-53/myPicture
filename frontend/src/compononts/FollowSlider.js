import React, { useEffect, useState } from "react";
import PersonImagesSlider from "./PersonImagesSlider";
import { jwtDecode } from "jwt-decode";

export default function FollowSlider({ activeTab }) {
  const [users, setUsers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const token = localStorage.getItem("token");
  const currentUserId = token ? jwtDecode(token).userId : null;

  useEffect(() => {
    if (!token || !currentUserId) return;

    const endpoint =
      activeTab === "following"
        ? `http://localhost:5000/api/follow/following/${currentUserId}`
        : `http://localhost:5000/api/follow/followers/${currentUserId}`;

    fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data || []);
        setActiveIndex(0);
      })
      .catch((err) => console.error("Takip verisi alınamadı:", err));
  }, [activeTab, currentUserId]);

  const prevUser = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const nextUser = () => {
    setActiveIndex((prev) => Math.min(prev + 1, users.length - 1));
  };

  if (users.length === 0) {
    return <p style={{ textAlign: "center", marginTop: 20 }}>Hiç kullanıcı bulunamadı.</p>;
  }

  const activeUser = users[activeIndex];

  return (
    <div style={{ marginTop: 30, textAlign: "center" }}>
      <button onClick={prevUser} disabled={activeIndex === 0}>
        ◀
      </button>

      <PersonImagesSlider
        userId={activeUser._id}
        isActive={true}
        showProfilePhoto={true}
        profilePhotoUrl={activeUser.profilePhotoUrl}
        username={activeUser.username}
      />

      <button onClick={nextUser} disabled={activeIndex === users.length - 1}>
        ▶
      </button>
    </div>
  );
}
