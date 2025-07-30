import React from "react";
import "./UserCard.css";

const UserCard = ({ userId, username }) => {
  return (
    <div className="user-card">
      <img src={`http://localhost:5000/api/users/${userId}/profile-pic`} alt={username} />
      <h3>{username}</h3>
    </div>
  );
};

export default UserCard;
