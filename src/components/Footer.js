import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <h2>PropertyRental</h2>
        </div>
        <div className="footer-links">
          <ul>
            <li><a href="/listings">Listings</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="footer-social">
          {/* Social media icons can use an icon library like Font Awesome */}
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PropertyRental. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;