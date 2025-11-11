import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function OnlineTutorialRequestPage() {
  const [activeTab, setActiveTab] = useState(null);
  const [skillName, setSkillName] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const skillTags = [
    'Web Development',
    'Data Science',
    'Mobile Development',
    'UI/UX Design',
    'Digital Marketing',
    'Machine Learning',
  ];

  const handleTab = (tab) => setActiveTab(tab);

  const handleSkillTagClick = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const handleEnterSkillSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      navigate('/');
    }, 2000);
  };

  const handleRequestSkillSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
    setTimeout(() => {
      setShowModal(false);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="container mt-5">
      <div className="request-container">
        <Link to="/" className="back-button">← Back</Link>
        <h2 className="text-center mb-4">Request Online Tutorial</h2>
        <p className="text-center text-muted mb-4">Choose how you'd like to request a tutorial</p>
        <div className="row">
          <div className="col-md-6">
            <div
              className={`request-option${activeTab === 'enter' ? ' active' : ''}`}
              onClick={() => handleTab('enter')}
              style={{ cursor: 'pointer' }}
            >
              <div className="text-center">
                <i className="fas fa-keyboard option-icon"></i>
                <h4>Enter Your Skill</h4>
                <p className="text-muted">Tell us what skill you want to learn</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className={`request-option${activeTab === 'request' ? ' active' : ''}`}
              onClick={() => handleTab('request')}
              style={{ cursor: 'pointer' }}
            >
              <div className="text-center">
                <i className="fas fa-search option-icon"></i>
                <h4>Request Specific Skill</h4>
                <p className="text-muted">Browse and select from available skills</p>
              </div>
            </div>
          </div>
        </div>
        {/* Enter Skill Form */}
        {activeTab === 'enter' && (
          <div className="mt-4">
            <h4 className="mb-3">Enter Your Required Skill</h4>
            <form onSubmit={handleEnterSkillSubmit}>
              <div className="mb-3">
                <label htmlFor="skillName" className="form-label">Skill Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="skillName"
                  placeholder="e.g., Python Programming"
                  value={skillName}
                  onChange={e => setSkillName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="skillDescription" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="skillDescription"
                  rows="3"
                  placeholder="Describe what you want to learn..."
                  value={skillDescription}
                  onChange={e => setSkillDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="skillLevel" className="form-label">Preferred Level</label>
                <select
                  className="form-control"
                  id="skillLevel"
                  value={skillLevel}
                  onChange={e => setSkillLevel(e.target.value)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <button type="submit" className="btn btn-submit w-100">Submit Request</button>
            </form>
          </div>
        )}
        {/* Request Specific Skill Form */}
        {activeTab === 'request' && (
          <div className="mt-4">
            <h4 className="mb-3">Select a Skill to Request</h4>
            <form onSubmit={handleRequestSkillSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="skillSearch"
                  placeholder="Search for skills..."
                  value={skillSearch}
                  onChange={e => setSkillSearch(e.target.value)}
                />
              </div>
              <div className="selected-count mb-3">
                <span className="badge bg-primary">
                  Selected: <span id="selectedCount">{selectedSkills.length}</span> skills
                </span>
              </div>
              <div className="skill-tags mb-3">
                {skillTags
                  .filter(skill => skill.toLowerCase().includes(skillSearch.toLowerCase()))
                  .map(skill => (
                    <div
                      key={skill}
                      className={`skill-tag${selectedSkills.includes(skill) ? ' selected' : ''}`}
                      onClick={() => handleSkillTagClick(skill)}
                      style={{ cursor: 'pointer', display: 'inline-block', margin: '0 5px 5px 0', padding: '5px 10px', border: '1px solid #007bff', borderRadius: '15px', background: selectedSkills.includes(skill) ? '#007bff' : '#fff', color: selectedSkills.includes(skill) ? '#fff' : '#007bff' }}
                    >
                      {skill}
                    </div>
                  ))}
              </div>
              <button type="submit" className="btn btn-submit w-100 mt-4" disabled={selectedSkills.length === 0}>
                Request Selected Skill
              </button>
            </form>
          </div>
        )}
        {/* Success Modal */}
        {showModal && (
          <div className="modal show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h5 className="modal-title">Request Submitted!</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body text-center">
                  <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                  <p className="mt-3">Your skill request has been submitted successfully!</p>
                  <p className="text-muted">Redirecting to the skill page...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnlineTutorialRequestPage; 