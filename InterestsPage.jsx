import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const interestsList = [
  { name: 'Web Development', icon: 'fa-code' },
  { name: 'Data Science', icon: 'fa-database' },
  { name: 'Mobile Development', icon: 'fa-mobile' },
  { name: 'Cloud Computing', icon: 'fa-cloud' },
  { name: 'AI/Machine Learning', icon: 'fa-brain' },
  { name: 'Cybersecurity', icon: 'fa-shield-alt' },
  { name: 'UI/UX Design', icon: 'fa-palette' },
  { name: 'Digital Marketing', icon: 'fa-bullhorn' },
  { name: 'Project Management', icon: 'fa-tasks' },
  { name: 'Game Development', icon: 'fa-gamepad' },
  { name: 'DevOps', icon: 'fa-server' },
  { name: 'Blockchain', icon: 'fa-link' },
];

function InterestsPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [finished, setFinished] = useState(false);

  const filteredInterests = interestsList.filter(interest =>
    interest.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleInterest = (name) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const handleFinish = () => {
    setFinished(true);
    setTimeout(() => setFinished(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', padding: '2rem' }}>
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/skillswap">Skill Swap</Link></li>
          <li><Link to="/online-tutorial-request">Online Tutorial Request</Link></li>
          <li><Link to="/online-tutorial">Online Tutorial</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/feedbacks">Feedbacks</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/event">Events</Link></li>
          <li><Link to="/chats">Chats</Link></li>
          <li><Link to="/interests">Interests</Link></li>
        </ul>
      </nav>
      <div className="container" style={{ maxWidth: 1200, background: 'white', borderRadius: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '4rem', textAlign: 'center', margin: '2rem auto' }}>
        <div className="header" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#1e293b', marginBottom: '1rem' }}>Welcome to Our Community!</h1>
          <p>Select your interests to get personalized recommendations</p>
        </div>
        <div className="search-container" style={{ margin: '2rem auto', maxWidth: 600 }}>
          <div className="search-bar" style={{ position: 'relative', marginBottom: '2rem' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
            <input
              type="text"
              placeholder="Search interests..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', border: '2px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '1rem' }}
            />
          </div>
        </div>
        <div className="interests-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', margin: '2rem 0' }}>
          {filteredInterests.map(interest => (
            <div
              key={interest.name}
              className={`interest-card${selected.includes(interest.name) ? ' selected' : ''}`}
              onClick={() => toggleInterest(interest.name)}
              style={{
                padding: '1.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: selected.includes(interest.name) ? '#6366f1' : '',
                borderColor: selected.includes(interest.name) ? '#6366f1' : '#e2e8f0',
                color: selected.includes(interest.name) ? 'white' : '',
                transition: 'all 0.3s ease',
              }}
            >
              <i className={`fas ${interest.icon}`}></i>
              <span>{interest.name}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" style={{ padding: '1rem 2rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', marginTop: '2rem' }} onClick={handleFinish}>
          Finish Setup
        </button>
        {finished && <div style={{ marginTop: 20, color: '#6366f1', fontWeight: 600 }}>Your interests have been saved!</div>}
      </div>
    </div>
  );
}

export default InterestsPage; 