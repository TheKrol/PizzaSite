import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Footer component representing the bottom section of the application.
 * Provides links to the contact and about pages, along with a copyright notice.
 */
const Footer = () => {
  return (
    <div className="footer">
      {/* Navigation links to Contact Us and About Us pages */}
      <Link to="/contact">Contact Us</Link> | <Link to="/about">About Us</Link>
      <br />

      {/* Copyright notice displaying the current year and the application name */}
      &copy; {new Date().getFullYear()} Pizza Connection
    </div>
  );
};

// Exporting the Footer component as the default export
export default Footer;
