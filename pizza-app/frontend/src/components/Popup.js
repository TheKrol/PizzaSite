import React from 'react';
import './Popup.css';

function Popup({ message, onClose }) {
  return (
    <div className="popup">
      <div className="popup-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Popup;