import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const demoEvents = [
  {
    icon: 'fas fa-laptop-code',
    color: 'var(--accent-color)',
    title: 'Web Development Bootcamp',
    date: 'May 25, 2025',
    location: 'Online (Zoom)',
    description: 'A hands-on workshop covering HTML, CSS, and JavaScript for beginners. Build your first website in a day!',
  },
  {
    icon: 'fas fa-users',
    color: 'var(--accent-color)',
    title: 'Networking Meetup',
    date: 'June 2, 2025',
    location: 'Cairo, Egypt',
    description: 'Meet professionals and students in tech, share your experiences, and grow your network. Snacks and drinks provided!',
  },
  {
    icon: 'fas fa-chalkboard-teacher',
    color: 'var(--accent-color)',
    title: 'UI/UX Design Masterclass',
    date: 'June 10, 2025',
    location: 'Online (Google Meet)',
    description: 'Learn the fundamentals of user interface and user experience design from industry experts. Includes live Q&A.',
  },
  {
    icon: 'fas fa-robot',
    color: 'var(--accent-color)',
    title: 'AI & Machine Learning Panel',
    date: 'June 18, 2025',
    location: 'Alexandria, Egypt',
    description: 'Panel discussion with AI professionals about the future of machine learning and career opportunities in AI.',
  },
];

function EventPage() {
  const [events, setEvents] = useState(demoEvents);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    icon: 'fas fa-calendar',
    color: 'var(--accent-color)',
  });
  const [toast, setToast] = useState('');

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddEvent = (e) => {
    e.preventDefault();
    setEvents([...events, newEvent]);
    setShowAdd(false);
    setNewEvent({ title: '', date: '', location: '', description: '', icon: 'fas fa-calendar', color: 'var(--accent-color)' });
    setToast('Event added!');
    setTimeout(() => setToast(''), 2000);
  };

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
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/event">Events</Link></li>
        </ul>
      </nav>
      {/* Hero Section */}
      <section className="hero" style={{background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))', padding: '60px 0 40px 0', textAlign: 'center', color: '#fff'}}>
        <div className="container">
          <h1 className="events-title" style={{color: '#fff', fontSize: '2.5rem', fontWeight: 700, marginBottom: 10}}><i className="fas fa-calendar-alt"></i> Upcoming Events</h1>
          <p className="hero-text" style={{fontSize: '1.2rem', maxWidth: 700, margin: '0 auto', opacity: 0.95}}>Stay up to date with the latest events, workshops, and meetups on Skill Bridge. Discover, join, or create events to boost your skills and network with others!</p>
        </div>
      </section>
      <main className="events-page" style={{background: 'linear-gradient(135deg, #e0e7ef 0%, #f6f8fa 100%)', minHeight: '70vh'}}>
        <div className="container events-container-main" style={{background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(44,62,80,0.10)', marginTop: -40, position: 'relative', zIndex: 2, padding: '36px 24px 32px 24px'}}>
          <div className="events-search-bar" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 30, gap: 10}}>
            <input type="text" className="form-control" placeholder="Search events..." aria-label="Search events" style={{maxWidth: 400, borderRadius: 8, border: '1.5px solid var(--accent-color)'}} value={search} onChange={e => setSearch(e.target.value)} />
            <button className="search-button btn" aria-label="Search" style={{background: 'var(--accent-color)', color: '#fff', borderRadius: 8, padding: '10px 18px'}}><i className="fas fa-search"></i></button>
          </div>
          <section id="event-list">
            <div className="events-grid">
              {filteredEvents.map((event, idx) => (
                <div className="event-card" key={idx}>
                  <div className="event-title"><i className={event.icon} style={{color: event.color}}></i> {event.title}</div>
                  <div className="event-date"><i className="fas fa-calendar-day"></i> {event.date}</div>
                  <div className="event-location"><i className="fas fa-map-marker-alt"></i> {event.location}</div>
                  <div className="event-description">{event.description}</div>
                  <a href="#" className="btn btn-primary" style={{marginTop: 10}} onClick={e => {e.preventDefault(); setToast('Joined event!'); setTimeout(() => setToast(''), 2000);}}><i className="fas fa-sign-in-alt"></i> Join</a>
                </div>
              ))}
            </div>
          </section>
          <section id="add-event-section">
            <h2 className="add-event-title" style={{color: 'var(--primary-color)', fontWeight: 700, marginTop: 40, textAlign: 'center'}}><i className="fas fa-plus-circle" style={{color: 'var(--accent-color)'}}></i> Add New Event</h2>
            <div style={{textAlign:'center', marginBottom:'1.5rem'}}>
              <button className="btn btn-primary" style={{fontSize:'1.1rem', padding:'12px 32px', marginTop:10}} onClick={() => setShowAdd(v => !v)}>
                <i className="fas fa-plus"></i> {showAdd ? 'Cancel' : 'Add Event'}
              </button>
            </div>
            {showAdd && (
              <form onSubmit={handleAddEvent} className="card2" style={{marginTop:'1rem', background:'#fff', border:'1.5px solid var(--accent-color)', boxShadow:'0 2px 12px rgba(44,62,80,0.07)', padding:24, borderRadius:12, maxWidth:500, marginLeft:'auto', marginRight:'auto'}}>
                <input type="text" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required style={{marginBottom:10, width:'100%', padding:8, borderRadius:6, border:'1px solid #ccc'}} />
                <input type="text" placeholder="Date (e.g. June 20, 2025)" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} required style={{marginBottom:10, width:'100%', padding:8, borderRadius:6, border:'1px solid #ccc'}} />
                <input type="text" placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} required style={{marginBottom:10, width:'100%', padding:8, borderRadius:6, border:'1px solid #ccc'}} />
                <textarea placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} required style={{marginBottom:10, width:'100%', padding:8, borderRadius:6, border:'1px solid #ccc'}} />
                <button type="submit" className="btn btn-primary" style={{marginTop:10}}>Add Event</button>
              </form>
            )}
          </section>
          {toast && <div style={{position:'fixed',bottom:32,right:32,zIndex:3000,background:'#3498db',color:'#fff',padding:'12px 24px',borderRadius:8,boxShadow:'0 2px 8px rgba(44,62,80,0.10)',fontWeight:600}}>{toast}</div>}
        </div>
      </main>
    </div>
  );
}

export default EventPage; 