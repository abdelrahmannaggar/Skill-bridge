import React from 'react';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

function ProfilePage() {
  return (
    <div className="profile-page">
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
      <h1>Profile Page</h1>
      <p>Welcome to your profile!</p>
    </div>
  );
}

export default ProfilePage; 