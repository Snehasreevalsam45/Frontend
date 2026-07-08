import React from "react";
import "./CustomPopup.css";

function CustomPopup({ message, onClose }) {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Message</h3>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export default CustomPopup;