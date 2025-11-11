import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SkillSwapPage.css';
import avatar1 from '../../frontend/Images/avatars/color-user-icon-white-background_961147-8.avif';
import avatar2 from '../../frontend/Images/avatars/3d-illustration-person-with-sunglasses_23-2149436188.avif';
import avatar3 from '../../frontend/Images/avatars/3d-rendering-hair-style-avatar-design_23-2151869153.avif';

const sendRequests = [
  {
    name: 'Robbie Harrison',
    role: 'Musician',
    stars: 4,
    experience: '8 years',
    connections: '3K+',
    projects: '65+',
    reviews: 146,
    avatar: avatar1,
  },
  {
    name: 'James Smith',
    role: 'Musician',
    stars: 3,
    experience: '5 years',
    connections: '5K+',
    projects: '60+',
    reviews: 128,
    avatar: avatar2,
  },
];

const receivedRequests = [
  {
    name: 'Robbie Harrison',
    role: 'Musician',
    stars: 4,
    experience: '8 years',
    connections: '3K+',
    projects: '65+',
    reviews: 146,
    avatar: avatar1,
    actions: ['accept', 'delete'],
  },
  {
    name: 'Jessamine Mumtaz',
    role: 'Designer',
    stars: 3,
    experience: '4 years',
    connections: '258',
    projects: '23',
    reviews: 19,
    avatar: avatar3,
    actions: ['accept', 'delete'],
  },
  {
    name: 'Jessamine Mumtaz',
    role: 'Stock Trader',
    stars: 4,
    experience: '5 years',
    connections: '500+',
    projects: '41',
    reviews: '200+',
    avatar: avatar3,
    actions: ['swap'],
  },
];

function SkillSwapPage() {
  const [tab, setTab] = useState('send');
  const [sendList, setSendList] = useState(sendRequests);
  const [receivedList, setReceivedList] = useState(receivedRequests);

  const handleTab = (tabName) => setTab(tabName);

  const handleAction = (type, idx, listType) => {
    const name = (listType === 'send' ? sendList : receivedList)[idx].name;
    if (window.confirm(`Are you sure you want to ${type === 'unswap' ? 'cancel the swap request with' : type === 'accept' ? 'accept the swap request from' : type === 'delete' ? 'decline the swap request from' : 'start a swap with'} ${name}?`)) {
      if (listType === 'send') {
        setSendList(list => list.filter((_, i) => i !== idx));
      } else {
        setReceivedList(list => list.filter((_, i) => i !== idx));
      }
    }
  };

  const renderStars = (count) => '★★★★★'.slice(0, count) + '☆☆☆☆☆'.slice(0, 5 - count);

  return (
    <div className="skillswap-page">
      <Link to="/" className="back-button">← Back</Link>
      <header>
        <h1>Skill Swap</h1>
        <div className="tabs">
          <button className={tab === 'send' ? 'active' : ''} onClick={() => handleTab('send')}>Send Requests</button>
          <button className={tab === 'received' ? 'active' : ''} onClick={() => handleTab('received')}>Received Requests</button>
        </div>
      </header>
      <main>
        <div className={`tab-content${tab === 'send' ? ' active' : ''}`}> 
          {sendList.map((user, idx) => (
            <div className="card" key={user.name + idx}>
              <img src={user.avatar} alt={user.name} />
              <div className="info">
                <h2>{user.name}</h2>
                <p>{user.role} <span className="stars">{renderStars(user.stars)}</span></p>
                <p>Experience: {user.experience}</p>
                <div className="stats">
                  <span className="stat-item">{user.connections} Connections</span>
                  <span className="stat-item">{user.projects} Projects</span>
                  <span className="stat-item">{user.reviews} Reviews</span>
                </div>
                <button className="unswap" onClick={() => handleAction('unswap', idx, 'send')}>Cancel Request</button>
              </div>
            </div>
          ))}
        </div>
        <div className={`tab-content${tab === 'received' ? ' active' : ''}`}> 
          {receivedList.map((user, idx) => (
            <div className="card" key={user.name + user.role + idx}>
              <img src={user.avatar} alt={user.name} />
              <div className="info">
                <h2>{user.name}</h2>
                <p>{user.role} <span className="stars">{renderStars(user.stars)}</span></p>
                <p>Experience: {user.experience}</p>
                <div className="stats">
                  <span className="stat-item">{user.connections} Connections</span>
                  <span className="stat-item">{user.projects} Projects</span>
                  <span className="stat-item">{user.reviews} Reviews</span>
                </div>
                {user.actions.includes('accept') && <button className="accept" onClick={() => handleAction('accept', idx, 'received')}>Accept</button>}
                {user.actions.includes('delete') && <button className="delete" onClick={() => handleAction('delete', idx, 'received')}>Decline</button>}
                {user.actions.includes('swap') && <button className="swap" onClick={() => handleAction('swap', idx, 'received')}>Start Swap</button>}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default SkillSwapPage; 