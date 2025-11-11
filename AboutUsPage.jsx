import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUsPage.css';

function AboutUsPage() {
  return (
    <div className="about-us-page">
      <nav className="navbar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
      </nav>
      <h1>About Us Page</h1>
      <p>Learn more about our mission and team.</p>
    </div>
  );
}

export default AboutUsPage; 