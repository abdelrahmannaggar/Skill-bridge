import React from 'react';
import { Link } from 'react-router-dom';
import './SignupPage.css';

function SignupPage() {
  return (
    <div className="signup-page">
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
      <h1>Signup Page</h1>
      <p>Please sign up to create an account.</p>
    </div>
  );
}

export default SignupPage; 