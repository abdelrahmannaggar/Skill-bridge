import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    icon: 'fas fa-code',
    title: 'Programming',
    desc: 'Learn coding languages and development skills',
  },
  {
    icon: 'fas fa-paint-brush',
    title: 'Design',
    desc: 'Master design tools and creative skills',
  },
  {
    icon: 'fas fa-chart-line',
    title: 'Business',
    desc: 'Develop business and management skills',
  },
  {
    icon: 'fas fa-language',
    title: 'Languages',
    desc: 'Learn new languages and communication skills',
  },
];

const tutorials = [
  {
    image: '/Images/programming.jpg',
    difficulty: 'Beginner',
    title: 'Introduction to Python',
    desc: 'Learn the basics of Python programming language',
    duration: '2 hours',
    author: 'John Doe',
  },
  {
    image: '/Images/design.jpg',
    difficulty: 'Intermediate',
    title: 'UI/UX Design Fundamentals',
    desc: 'Master the principles of user interface design',
    duration: '3 hours',
    author: 'Jane Smith',
  },
  {
    image: '/Images/business.jpg',
    difficulty: 'Advanced',
    title: 'Digital Marketing Strategy',
    desc: 'Learn effective digital marketing techniques',
    duration: '4 hours',
    author: 'Mike Johnson',
  },
];

function OnlineTutorialPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Show popup after 0.5s
    const showTimer = setTimeout(() => {
      setShowPopup(true);
      setProgress(100);
    }, 500);
    // Hide popup after 5.5s
    const hideTimer = setTimeout(() => {
      setShowPopup(false);
    }, 5500);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div>
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
        </ul>
      </nav>
      {/* Welcome Popup */}
      {showPopup && (
        <>
          <div className="overlay active"></div>
          <div className="welcome-popup active">
            <div className="icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h2>Welcome to Skill Bridge!</h2>
            <p>Discover a world of learning opportunities. Browse through our tutorials and start your learning journey today.</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </>
      )}
      <div className="tutorial-container">
        <div className="tutorial-header">
          <h1>Online Tutorial Platform</h1>
          <p>Explore our comprehensive tutorials and enhance your skills with expert guidance.</p>
        </div>
        <div className="tutorial-categories">
          {categories.map((cat, idx) => (
            <div className="category-card" key={cat.title}>
              <div className="category-icon">
                <i className={cat.icon}></i>
              </div>
              <h3>{cat.title}</h3>
              <p>{cat.desc}</p>
              <a href="#" className="category-link" onClick={e => {e.preventDefault(); alert('Tutorial content will be loaded here');}}>View Tutorials</a>
            </div>
          ))}
        </div>
        <div className="featured-tutorials">
          <h2>Featured Tutorials</h2>
          <div className="tutorial-grid">
            {tutorials.map((tut, idx) => (
              <div className="tutorial-card" key={tut.title}>
                <div className="tutorial-image">
                  <img src={tut.image} alt={tut.title} />
                  <span className="difficulty">{tut.difficulty}</span>
                </div>
                <div className="tutorial-content">
                  <h3>{tut.title}</h3>
                  <p>{tut.desc}</p>
                  <div className="tutorial-meta">
                    <span><i className="fas fa-clock"></i> {tut.duration}</span>
                    <span><i className="fas fa-user"></i> {tut.author}</span>
                  </div>
                  <a href="#" className="tutorial-button" onClick={e => {e.preventDefault(); alert('Tutorial content will be loaded here');}}>Start Learning</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnlineTutorialPage; 