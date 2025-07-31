
import React from "react";
import "./ArrowButton.css"; // CSS dosyasını aynı klasöre koy

export default function ArrowButton({ direction = "left", onClick }) {
  return (
    <div
      className={`arrow ${direction === "right" ? "right" : "left"}`}
      onClick={onClick}
    >
      <div className="arrow-top"></div>
      <div className="arrow-bottom"></div>
    </div>
  );
}
