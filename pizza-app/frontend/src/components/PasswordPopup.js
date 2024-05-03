import React from 'react';
import './PasswordPopup.css';

/**
 * PasswordPopup component representing a popup with password criteria.
 * @param {function} onClose - Function to close the password popup.
 */
const PasswordPopup = ({ onClose }) => {
  return (
    <div className="password-popup">
      {/* Close button for the password popup */}
      <span className="popup-close" onClick={onClose}>&times;</span>

      {/* Title of the password popup */}
      <div className="popup-title">Password Criteria</div>

      {/* Content of the password popup with a list of password criteria */}
      <div className="popup-content">
        <ul>
          <li>Include at least 1 uppercase letter</li>
          <li>Include at least 1 lowercase letter</li>
          <li>Include at least 1 number</li>
          <li>Include at least 1 special character</li>
          <li>Be at least 8 characters long</li>
        </ul>
      </div>
    </div>
  );
};

// Exporting the PasswordPopup component as the default export
export default PasswordPopup;
