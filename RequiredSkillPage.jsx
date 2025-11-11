import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RequiredSkillPage() {
  const [name, setName] = useState('');
  const [skill, setSkill] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setSkill('');
    }, 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#dbe8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/online-tutorial">Online Tutorial</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/signup" className="btn"><i className="fas fa-user"></i> Sign Up</Link></li>
          <li><Link to="/login" className="btn"><i className="fas fa-user"></i> Log In</Link></li>
        </ul>
      </nav>
      <h1 style={{ color: '#333', margin: '40px 0 30px 0', textAlign: 'center' }}>Enter Required Skill</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15, background: 'white', padding: 30, borderRadius: 10, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Skill Needed"
          value={skill}
          onChange={e => setSkill(e.target.value)}
          required
        />
        <button type="submit" style={{ backgroundColor: '#43b3f3', color: 'white', cursor: 'pointer', border: 'none' }}>Submit</button>
      </form>
      {submitted && (
        <div style={{ marginTop: 20, color: '#43b3f3', fontWeight: 600 }}>Thank you! Your request has been submitted.</div>
      )}
    </div>
  );
}

export default RequiredSkillPage; 