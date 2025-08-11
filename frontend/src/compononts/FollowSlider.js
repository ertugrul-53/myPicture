import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./FollowSlider.css";

export default function FollowSlider({ activeTab }) {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");
  const currentUserId = token ? jwtDecode(token)?.userId : null;

  useEffect(() => {
    if (!token || !currentUserId) return;

    const endpoint =
      activeTab === "following"
        ? `http://localhost:5000/api/follow/following/${currentUserId}`
        : `http://localhost:5000/api/follow/followers/${currentUserId}`;

    const fetchUsers = async () => {
      try {
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setUsers(data || []);
      } catch (err) {
        console.error("Takip verisi alınamadı:", err);
      }
    };

    fetchUsers();
  }, [activeTab, currentUserId, token]);

  const handleUnfollow = async (followingId) => {
    if (!token) {
      alert("Lütfen giriş yapınız.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/follow/unfollow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ followingId }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data.message);

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== followingId));
    } catch (error) {
      console.error("Takip bırakma işlemi başarısız:", error);
    }
  };

  if (!users.length) {
    return <p style={{ textAlign: "center", marginTop: 20 }}>Hiç kullanıcı bulunamadı.</p>;
  }

  return (
    <div className="follow-list-simple">
      {users.map((user) => (
        <div key={user._id} className="follow-user-simple">
          <img
            src="images/logo.png"
            alt={`${user.username} profil`}
            className="follow-photo-simple"
          />
          <div className="follow-name-simple">{user.username}</div>
          <button className="unfollow-button" onClick={() => handleUnfollow(user._id)}>
                Unfollow
          </button>
        </div>
      ))}
    </div>
  );
}
