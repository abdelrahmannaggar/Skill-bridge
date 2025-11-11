import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const demoChats = [
  {
    username: 'John Doe',
    avatar: 'JD',
    online: true,
    lastMessage: "Hey, how's it going?",
    time: '2:30 PM',
    status: 'Online',
    messages: [
      { from: 'them', text: "Hey, how's it going?", time: '2:30 PM' },
      { from: 'me', text: "I'm doing great! How about you?", time: '2:31 PM' },
      { from: 'them', text: 'Pretty good! Just working on some new projects.', time: '2:32 PM' },
    ],
  },
  {
    username: 'Alice Smith',
    avatar: 'AS',
    online: false,
    lastMessage: 'Can we schedule a meeting?',
    time: '1:45 PM',
    status: 'Offline',
    messages: [
      { from: 'them', text: 'Can we schedule a meeting?', time: '1:45 PM' },
    ],
  },
  {
    username: 'Robert Johnson',
    avatar: 'RJ',
    online: true,
    lastMessage: 'Thanks for your help!',
    time: '11:20 AM',
    status: 'Online',
    messages: [
      { from: 'them', text: 'Thanks for your help!', time: '11:20 AM' },
    ],
  },
  {
    username: 'Maria Lee',
    avatar: 'ML',
    online: false,
    lastMessage: 'The project looks great!',
    time: 'Yesterday',
    status: 'Offline',
    messages: [
      { from: 'them', text: 'The project looks great!', time: 'Yesterday' },
    ],
  },
  {
    username: 'Project Team',
    avatar: <i className="fas fa-users"></i>,
    online: false,
    lastMessage: "Let's meet at 2 PM today.",
    time: '10:00 AM',
    status: 'Group',
    messages: [
      { from: 'them', text: "Let's meet at 2 PM today.", time: '10:00 AM' },
    ],
  },
];

function ChatsPage() {
  const [chats, setChats] = useState(demoChats);
  const [selected, setSelected] = useState(0);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected, chats]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setChats((prev) => {
      const updated = [...prev];
      updated[selected].messages.push({ from: 'me', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      updated[selected].lastMessage = message;
      updated[selected].time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return updated;
    });
    setMessage('');
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
          <li><Link to="/chats">Chats</Link></li>
        </ul>
      </nav>
      <div className="chat-main-layout" style={{display:'flex',height:'80vh',background:'#f6f8fa'}}>
        {/* Left Sidebar */}
        <aside className="recent-chats-sidebar" style={{width:300,background:'#fff',borderRight:'1px solid #e0e7ef',display:'flex',flexDirection:'column'}}>
          <div className="sidebar-header" style={{padding:16,borderBottom:'1px solid #e0e7ef'}}>
            <div className="header-content" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h2 style={{margin:0,fontSize:'1.2rem'}}>Messages</h2>
              <button className="new-chat-btn" title="Start New Chat"><i className="fas fa-plus"></i></button>
            </div>
            <div className="search-box" style={{marginTop:10,display:'flex',alignItems:'center',background:'#f6f8fa',borderRadius:8,padding:'4px 8px'}}>
              <i className="fas fa-search" style={{marginRight:6}}></i>
              <input type="text" placeholder="Search conversations..." style={{border:'none',background:'transparent',outline:'none',width:'100%'}} />
            </div>
          </div>
          <div className="recent-chats-list" style={{flex:1,overflowY:'auto'}}>
            {chats.map((chat, idx) => (
              <div className={`recent-chat${selected === idx ? ' active' : ''}`} key={chat.username} style={{display:'flex',alignItems:'center',padding:12,cursor:'pointer',background:selected===idx?'#eaf6fd':'',borderBottom:'1px solid #f6f8fa'}} onClick={() => setSelected(idx)}>
                <div className={`avatar status-dot ${chat.online ? 'online' : 'offline'}`} style={{width:40,height:40,borderRadius:'50%',background:'#e0e7ef',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:600,marginRight:12}}>{chat.avatar}</div>
                <div className="chat-info" style={{flex:1}}>
                  <div className="chat-header" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <h4 style={{margin:0,fontSize:'1rem'}}>{chat.username}</h4>
                    <span className="time" style={{fontSize:'0.9em',color:'#888'}}>{chat.time}</span>
                  </div>
                  <p className="last-message" style={{margin:0,fontSize:'0.95em',color:'#666'}}>{chat.lastMessage}</p>
                  <span className="user-status-text" style={{fontSize:'0.85em',color:chat.online?'#10b981':'#aaa'}}>{chat.status}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
        {/* Main Chat Area */}
        <div className="chat" style={{flex:1,display:'flex',flexDirection:'column',background:'#f6f8fa'}}>
          <div className="chat-header" style={{padding:16,borderBottom:'1px solid #e0e7ef',display:'flex',alignItems:'center',gap:12}}>
            <div className="chat-header-user" style={{display:'flex',alignItems:'center',gap:12}}>
              <div className={`avatar status-dot ${chats[selected].online ? 'online' : 'offline'}`} style={{width:40,height:40,borderRadius:'50%',background:'#e0e7ef',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:600}}>{chats[selected].avatar}</div>
              <div>
                <h3 style={{margin:0,fontSize:'1.1rem'}}>{chats[selected].username}</h3>
                <span className={`status ${chats[selected].online ? 'online' : 'offline'}`} style={{fontSize:'0.95em',color:chats[selected].online?'#10b981':'#aaa'}}>{chats[selected].status}</span>
              </div>
            </div>
            <div className="chat-actions" style={{marginLeft:'auto',display:'flex',gap:8}}>
              <button className="action-btn" title="Start Video Call"><i className="fas fa-video"></i></button>
              <button className="action-btn" title="Start Google Meet"><i className="fab fa-google"></i></button>
              <button className="action-btn" title="More Options"><i className="fas fa-ellipsis-v"></i></button>
            </div>
          </div>
          <div className="chat-messages" style={{flex:1,overflowY:'auto',padding:24,background:'#f6f8fa'}}>
            {chats[selected].messages.map((msg, idx) => (
              <div key={idx} className={`message-group ${msg.from === 'me' ? 'sent' : 'received'}`} style={{display:'flex',alignItems:'flex-end',marginBottom:16,flexDirection:msg.from==='me'?'row-reverse':'row'}}>
                <div className="avatar" style={{width:32,height:32,borderRadius:'50%',background:'#e0e7ef',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:600,margin:msg.from==='me'?'0 0 0 12px':'0 12px 0 0'}}>{msg.from==='me'?'Me':chats[selected].avatar}</div>
                <div className="bubble" style={{background:msg.from==='me'?'#43b3f3':'#fff',color:msg.from==='me'?'#fff':'#333',padding:'10px 16px',borderRadius:16,maxWidth:320,boxShadow:'0 2px 8px rgba(44,62,80,0.07)',position:'relative'}}>
                  {msg.text}
                  <span className="timestamp" style={{display:'block',fontSize:'0.8em',color:'#888',marginTop:4}}>{msg.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
          <form className="chat-input" style={{display:'flex',alignItems:'center',padding:16,borderTop:'1px solid #e0e7ef',background:'#fff'}} onSubmit={handleSend}>
            <input type="text" placeholder="Type a message..." value={message} onChange={e => setMessage(e.target.value)} style={{flex:1,padding:10,borderRadius:8,border:'1px solid #e0e7ef',marginRight:10}} />
            <button type="submit" className="btn btn-primary" style={{padding:'10px 24px'}}><i className="fas fa-paper-plane"></i> Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatsPage; 