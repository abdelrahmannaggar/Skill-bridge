import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const demoLogins = [
  { icon: 'fas fa-desktop', text: 'Chrome on Windows - Cairo, Egypt', time: '(Just now)' },
  { icon: 'fas fa-mobile-alt', text: 'Mobile Safari - Giza, Egypt', time: '(2 days ago)' },
  { icon: 'fas fa-desktop', text: 'Firefox on Linux - Alexandria, Egypt', time: '(1 week ago)' },
];

function SettingsPage() {
  // Profile
  const [avatar, setAvatar] = useState('/Images/default-avatar.png');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileReset, setProfileReset] = useState(false);
  const avatarInput = useRef();

  // Security & Privacy
  const [twoFA, setTwoFA] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);

  // Notifications
  const [systemNotif, setSystemNotif] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [reminders, setReminders] = useState(true);

  // Theme & Accessibility
  const [darkMode, setDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState('#3498db');
  const [fontSize, setFontSize] = useState('16px');
  const [highContrast, setHighContrast] = useState(false);

  // Advanced
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('Africa/Cairo');
  const [betaFeatures, setBetaFeatures] = useState(false);

  // Toast
  const [toast, setToast] = useState('');

  // Avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Profile form
  const handleProfileSave = (e) => {
    e.preventDefault();
    setProfileSaved(true);
    setToast('Profile saved!');
    setTimeout(() => setProfileSaved(false), 2000);
    setTimeout(() => setToast(''), 2500);
  };
  const handleProfileReset = () => {
    setUsername(''); setName(''); setEmail(''); setBio(''); setPassword('');
    setAvatar('/Images/default-avatar.png');
    setProfileReset(true);
    setToast('Profile changes undone.');
    setTimeout(() => setProfileReset(false), 2000);
    setTimeout(() => setToast(''), 2500);
  };

  // Privacy actions
  const handleDownloadData = () => { setToast('Download started!'); setTimeout(() => setToast(''), 2000); };
  const handleLogoutAll = () => { setToast('Logged out of all devices!'); setTimeout(() => setToast(''), 2000); };

  // Notification preview
  const notificationPreview = <div style={{marginTop:8,padding:'12px 18px',background:'#eaf6fd',borderRadius:8,color:'#3498db',fontSize:'1rem'}}><i className="fas fa-bell"></i> This is how your notifications will appear!</div>;

  // Theme & Accessibility
  const handleThemeToggle = () => setDarkMode((d) => !d);

  // Account actions
  const handleDeleteAccount = () => { if(window.confirm('Are you sure you want to delete your account?')) setToast('Account deleted!'); setTimeout(() => setToast(''), 2000); };

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
        </ul>
      </nav>
      <main className="settings-page">
        <div className="settings-container">
          <h1 className="settings-title"><i className="fas fa-cog"></i> Settings</h1>
          {/* Profile Section */}
          <section className="settings-section">
            <h2 className="settings-section-title">Profile</h2>
            <form className="settings-form" onSubmit={handleProfileSave}>
              <div className="profile-picture-upload" style={{display:'flex',flexDirection:'column',alignItems:'center',marginBottom:18}}>
                <img src={avatar} alt="Profile Avatar" className="profile-avatar" style={{width:80,height:80,borderRadius:'50%',objectFit:'cover',boxShadow:'0 2px 8px rgba(44,62,80,0.10)'}} />
                <button type="button" className="change-pic-btn" aria-label="Change Photo" style={{marginTop:-28,position:'relative',zIndex:2,background:'#fff',border:'none',boxShadow:'0 2px 8px rgba(44,62,80,0.10)',borderRadius:'50%',width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'background 0.2s'}} onClick={() => avatarInput.current.click()}>
                  <i className="fas fa-camera" style={{color:'#3498db',fontSize:'1.2rem'}}></i>
                </button>
                <input type="file" accept="image/*" style={{display:'none'}} ref={avatarInput} onChange={handleAvatarChange} />
              </div>
              <div className="form-group">
                <input type="text" id="settings-username" name="username" placeholder=" " autoComplete="username" value={username} onChange={e => setUsername(e.target.value)} />
                <label htmlFor="settings-username">Username</label>
              </div>
              <div className="form-group">
                <input type="text" id="settings-name" name="name" placeholder=" " autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
                <label htmlFor="settings-name">Name</label>
              </div>
              <div className="form-group">
                <input type="email" id="settings-email" name="email" placeholder=" " autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
                <label htmlFor="settings-email">Email</label>
              </div>
              <div className="form-group">
                <textarea id="settings-bio" name="bio" placeholder=" " rows={2} value={bio} onChange={e => setBio(e.target.value)}></textarea>
                <label htmlFor="settings-bio">Short Bio</label>
              </div>
              <div className="form-group">
                <input type="password" id="settings-password" name="password" placeholder=" " autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} />
                <label htmlFor="settings-password">Password</label>
              </div>
              <div style={{display:'flex',gap:10}}>
                <button type="submit" className="btn btn-primary">Save Profile</button>
                <button type="button" className="btn btn-secondary" onClick={handleProfileReset}>Undo Changes</button>
              </div>
            </form>
          </section>
          {/* Security & Privacy Section */}
          <section className="settings-section">
            <h2 className="settings-section-title">Security & Privacy</h2>
            <div className="settings-toggles">
              <div className="toggle-group">
                <span>Two-Factor Authentication (2FA)</span>
                <label className="switch">
                  <input type="checkbox" checked={twoFA} onChange={() => setTwoFA(v => !v)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="toggle-group">
                <span>Profile Visibility</span>
                <label className="switch">
                  <input type="checkbox" checked={profileVisible} onChange={() => setProfileVisible(v => !v)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <div style={{marginTop:18}}>
              <strong>Recent Login Activity</strong>
              <ul style={{marginTop:8,fontSize:'0.98rem',color:'#666'}}>
                {demoLogins.map((item, idx) => (
                  <li key={idx}><i className={item.icon}></i> {item.text} <span style={{color:'#aaa'}}>{item.time}</span></li>
                ))}
              </ul>
            </div>
            <div className="privacy-actions">
              <button className="btn btn-light-color" onClick={handleDownloadData}><i className="fas fa-download"></i> Download My Data</button>
              <button className="btn btn-light-color" onClick={handleLogoutAll}><i className="fas fa-sign-out-alt"></i> Log Out All Devices</button>
            </div>
          </section>
          {/* Notification Controls Section */}
          <section className="settings-section">
            <h2 className="settings-section-title">Notifications</h2>
            <div className="settings-toggles">
              <div className="toggle-group">
                <span>System Notifications</span>
                <label className="switch">
                  <input type="checkbox" checked={systemNotif} onChange={() => setSystemNotif(v => !v)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="toggle-group">
                <span>Marketing Emails</span>
                <label className="switch">
                  <input type="checkbox" checked={marketingEmails} onChange={() => setMarketingEmails(v => !v)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="toggle-group">
                <span>Reminders</span>
                <label className="switch">
                  <input type="checkbox" checked={reminders} onChange={() => setReminders(v => !v)} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <div style={{marginTop:18}}>
              <strong>Notification Preview</strong>
              {notificationPreview}
            </div>
          </section>
          {/* Theme & Accessibility Section */}
          <section className="settings-section">
            <h2 className="settings-section-title">Theme & Accessibility</h2>
            <div className="theme-toggle-group">
              <label className="theme-switch">
                <input type="checkbox" checked={darkMode} onChange={handleThemeToggle} />
                <span className="theme-slider"></span>
              </label>
              <span id="theme-label">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div style={{marginTop:18,display:'flex',gap:18,alignItems:'center',flexWrap:'wrap'}}>
              <div>
                <label><i className="fas fa-palette"></i> Accent Color:</label>
                <select value={accentColor} onChange={e => setAccentColor(e.target.value)} style={{marginLeft:8,padding:'4px 10px',borderRadius:6}}>
                  <option value="#3498db">Blue</option>
                  <option value="#10b981">Green</option>
                  <option value="#e67e22">Orange</option>
                  <option value="#e74c3c">Red</option>
                  <option value="#9b59b6">Purple</option>
                </select>
              </div>
              <div>
                <label><i className="fas fa-text-height"></i> Font Size:</label>
                <select value={fontSize} onChange={e => setFontSize(e.target.value)} style={{marginLeft:8,padding:'4px 10px',borderRadius:6}}>
                  <option value="16px">Default</option>
                  <option value="18px">Large</option>
                  <option value="20px">Extra Large</option>
                </select>
              </div>
              <div>
                <label><input type="checkbox" checked={highContrast} onChange={() => setHighContrast(v => !v)} /> High Contrast</label>
              </div>
            </div>
          </section>
          {/* Account Management Section */}
          <section className="settings-section">
            <h2 className="settings-section-title">Account Management</h2>
            <div style={{marginBottom:18}}>
              <strong>Connected Accounts</strong>
              <div style={{marginTop:8,display:'flex',gap:12,flexWrap:'wrap'}}>
                <button className="btn social-btn google"><i className="fab fa-google"></i> Google <span style={{fontSize:'0.9em',color:'#888'}}>(Connected)</span></button>
                <button className="btn social-btn linkedin"><i className="fab fa-linkedin"></i> LinkedIn <span style={{fontSize:'0.9em',color:'#888'}}>(Not Connected)</span></button>
                <button className="btn social-btn facebook"><i className="fab fa-facebook"></i> Facebook <span style={{fontSize:'0.9em',color:'#888'}}>(Not Connected)</span></button>
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <strong>Change Email/Password</strong>
              <div style={{marginTop:8,display:'flex',gap:10,flexWrap:'wrap'}}>
                <button className="btn btn-light-color"><i className="fas fa-envelope"></i> Change Email</button>
                <button className="btn btn-light-color"><i className="fas fa-key"></i> Change Password</button>
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <strong>Session Management</strong>
              <div style={{marginTop:8}}>
                <button className="btn btn-light-color"><i className="fas fa-sign-out-alt"></i> Log Out All Sessions</button>
              </div>
            </div>
          </section>
          {/* Advanced Section */}
          <section className="settings-section">
            <h2 className="settings-section-title">Advanced</h2>
            <div style={{display:'flex',gap:18,flexWrap:'wrap',alignItems:'center'}}>
              <div>
                <label><i className="fas fa-language"></i> Language:</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} style={{marginLeft:8,padding:'4px 10px',borderRadius:6}}>
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              <div>
                <label><i className="fas fa-clock"></i> Time Zone:</label>
                <select value={timezone} onChange={e => setTimezone(e.target.value)} style={{marginLeft:8,padding:'4px 10px',borderRadius:6}}>
                  <option value="Africa/Cairo">Africa/Cairo</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </div>
              <div>
                <label><input type="checkbox" checked={betaFeatures} onChange={() => setBetaFeatures(v => !v)} /> Enable Beta Features</label>
              </div>
            </div>
          </section>
          {/* Help & Support Section */}
          <section className="settings-section">
            <h2 className="settings-section-title">Help & Support</h2>
            <div style={{display:'flex',gap:14,flexWrap:'wrap',alignItems:'center'}}>
              <a href="/faq" className="btn btn-light-color"><i className="fas fa-question-circle"></i> FAQ</a>
              <a href="mailto:support@skillbridge.com" className="btn btn-light-color"><i className="fas fa-envelope"></i> Email Support</a>
              <a href="#" className="btn btn-light-color"><i className="fas fa-comments"></i> Live Chat</a>
            </div>
          </section>
          {/* Account Actions Section */}
          <section className="settings-section danger-section">
            <h2 className="settings-section-title">Account</h2>
            <button className="btn btn-danger" onClick={handleDeleteAccount}><i className="fas fa-trash"></i> Delete Account</button>
          </section>
          {/* Toast Notification */}
          {toast && <div style={{position:'fixed',bottom:32,right:32,zIndex:3000,background:'#3498db',color:'#fff',padding:'12px 24px',borderRadius:8,boxShadow:'0 2px 8px rgba(44,62,80,0.10)',fontWeight:600}}>{toast}</div>}
        </div>
      </main>
    </div>
  );
}

export default SettingsPage; 