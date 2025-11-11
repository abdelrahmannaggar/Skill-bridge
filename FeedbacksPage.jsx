import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const demoFeedbacks = [
  {
    name: 'Alice Johnson',
    rating: 5,
    comment: 'Skill Bridge helped me connect with amazing mentors! Highly recommended.',
    date: '2024-05-01',
  },
  {
    name: 'Mohamed Salah',
    rating: 4,
    comment: 'Great platform for learning new skills. The swap feature is unique!',
    date: '2024-04-28',
  },
  {
    name: 'Sara Lee',
    rating: 5,
    comment: 'The tutorials are top-notch and the community is very supportive.',
    date: '2024-04-20',
  },
  {
    name: 'John Doe',
    rating: 4,
    comment: 'Easy to use and lots of opportunities to grow.',
    date: '2024-04-15',
  },
];

function averageRating(feedbacks) {
  if (!feedbacks.length) return 0;
  return (
    feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
  ).toFixed(1);
}

function renderStars(rating) {
  return (
    <span className="stars">
      {'★'.repeat(Math.round(rating))}
      {'☆'.repeat(5 - Math.round(rating))}
    </span>
  );
}

function FeedbacksPage() {
  const [feedbacks] = useState(demoFeedbacks);
  const avgRating = averageRating(feedbacks);

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/skillswap">Skill Swap</Link></li>
          <li><Link to="/online-tutorial-request">Online Tutorial</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/feedbacks">Feedbacks</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
        </ul>
      </nav>
      {/* Hero Section */}
      <section className="hero" style={{background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', padding: '60px 0 40px 0', textAlign: 'center', color: '#fff'}}>
        <div className="container">
          <h1 className="feedbacks-title" style={{color: '#fff', fontSize: '2.5rem', fontWeight: 700, marginBottom: 10}}><i className="fas fa-comments"></i> User Feedback & Ratings</h1>
          <p className="hero-text" style={{fontSize: '1.2rem', maxWidth: 700, margin: '0 auto', opacity: 0.95}}>See what our users are saying about Skill Bridge. Your feedback helps us grow and improve!</p>
        </div>
      </section>
      <main className="feedbacks-page" style={{background: 'linear-gradient(135deg, #e0e7ef 0%, #f6f8fa 100%)', minHeight: '70vh'}}>
        <div className="container feedbacks-container" style={{background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(44,62,80,0.10)', marginTop: -40, position: 'relative', zIndex: 2, padding: '36px 24px 32px 24px'}}>
          {/* Summary Section */}
          <section className="feedback-summary" style={{background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 8px rgba(44,62,80,0.07)', marginBottom: 40}}>
            <div className="average-rating">
              <span className="avg-rating-value">{avgRating}</span>
              {renderStars(avgRating)}
              <span className="total-feedbacks" style={{color: '#888'}}>({feedbacks.length} feedbacks)</span>
            </div>
          </section>
          {/* Feedback List */}
          <section className="feedback-list-section">
            <h2 className="feedback-list-title" style={{color: 'var(--primary-color)', fontSize: '1.4rem', fontWeight: 700, marginBottom: 24}}>Recent Feedback</h2>
            <div className="feedback-list">
              {feedbacks.map((fb, idx) => (
                <div key={idx} className="feedback-card" style={{background: '#f8fafc', borderRadius: 10, boxShadow: '0 2px 8px rgba(44,62,80,0.07)', marginBottom: 20, padding: 20}}>
                  <div className="feedback-header" style={{display: 'flex', alignItems: 'center', marginBottom: 8}}>
                    <span className="feedback-user" style={{fontWeight: 600, marginRight: 10}}>{fb.name}</span>
                    {renderStars(fb.rating)}
                    <span className="feedback-date" style={{marginLeft: 'auto', color: '#888', fontSize: '0.9em'}}>{fb.date}</span>
                  </div>
                  <div className="feedback-comment" style={{color: '#333'}}>{fb.comment}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default FeedbacksPage; 