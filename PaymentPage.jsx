import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PaymentPage.css';

const plans = [
  {
    name: 'Free',
    price: 0,
    features: [
      'Access to basic courses',
      'Community forum access',
      'Basic learning resources',
    ],
  },
  {
    name: 'Pro',
    price: 35,
    features: [
      'All Free features',
      'Access to premium courses',
      '1-on-1 mentoring sessions',
      'Certificate of completion',
    ],
    featured: true,
  },
  {
    name: 'Elite',
    price: 50,
    features: [
      'All Pro features',
      'Unlimited mentoring',
      'Priority support',
      'Exclusive workshops',
      'Job placement assistance',
    ],
  },
];

const paymentMethods = [
  { key: 'card', label: 'Card', icon: 'fas fa-credit-card' },
  { key: 'paypal', label: 'PayPal', icon: 'fab fa-paypal' },
  { key: 'applepay', label: 'Apple Pay', icon: 'fab fa-apple' },
  { key: 'fawry', label: 'Fawry', icon: 'fas fa-building-columns' },
  { key: 'vodafone', label: 'Vodafone', icon: 'fas fa-mobile-alt' },
];

function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [cardType, setCardType] = useState('');
  const [form, setForm] = useState({ name: '', email: '', card: '', expiry: '', cvc: '' });

  const handlePlanSelect = (plan) => setSelectedPlan(plan);
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setCardType('');
  };
  const handleCardTypeChange = (e) => setCardType(e.target.value);
  const handleInputChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlan || !selectedMethod || !form.name || !form.email) {
      alert('Please fill all required fields and select a plan.');
      return;
    }
    alert(`Thank you ${form.name}, your payment for the ${selectedPlan} plan via ${selectedMethod} is being processed.`);
  };

  return (
    <div className="payment-page">
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
      <main className="container">
        <div className="payment-container">
          <div className="payment-header">
            <h1>Choose Your Plan</h1>
            <p>Select the perfect plan for your learning journey</p>
          </div>
          <div className="plans-grid">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`plan-card${plan.featured ? ' featured' : ''}${selectedPlan === plan.name ? ' active' : ''}`}
              >
                <div className="plan-header">
                  <h3>{plan.name} Plan</h3>
                  <div className="price">
                    ${plan.price}
                    <span>/month</span>
                  </div>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}><i className="fas fa-check"></i> {feature}</li>
                  ))}
                </ul>
                <button
                  className="btn btn-outline plan-select"
                  onClick={() => handlePlanSelect(plan.name)}
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>
          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Payment Details</h2>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="John Doe" value={form.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" placeholder="john@example.com" value={form.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <div className="payment-methods">
                  {paymentMethods.map((method) => (
                    <button
                      type="button"
                      key={method.key}
                      className={`pay-btn${selectedMethod === method.key ? ' active' : ''}`}
                      onClick={() => handleMethodSelect(method.key)}
                    >
                      <i className={method.icon}></i> {method.label}
                    </button>
                  ))}
                </div>
              </div>
              {selectedMethod === 'card' && (
                <div className="method-group">
                  <label htmlFor="card-type">Card Type</label>
                  <select id="card-type" value={cardType} onChange={handleCardTypeChange}>
                    <option value="">-- Select Card Type --</option>
                    <option value="credit">Credit Card</option>
                    <option value="debit">Debit Card</option>
                  </select>
                  {cardType && (
                    <div id="card-fields" className="method-group">
                      <div className="form-group">
                        <label htmlFor="card">Card Number</label>
                        <input type="text" id="card" placeholder="1234 5678 9012 3456" value={form.card} onChange={handleInputChange} />
                      </div>
                      <div className="form-row">
                        <div className="form-group half">
                          <label htmlFor="expiry">Expiry</label>
                          <input type="text" id="expiry" placeholder="MM/YY" value={form.expiry} onChange={handleInputChange} />
                        </div>
                        <div className="form-group half">
                          <label htmlFor="cvc">CVC</label>
                          <input type="text" id="cvc" placeholder="123" value={form.cvc} onChange={handleInputChange} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {selectedMethod === 'paypal' && (
                <div className="method-group"><p>Redirecting to PayPal to complete your payment.</p></div>
              )}
              {selectedMethod === 'applepay' && (
                <div className="method-group"><p>Processing with Apple Pay on your device.</p></div>
              )}
              {selectedMethod === 'fawry' && (
                <div className="method-group"><p>Pay via Fawry kiosk using code <strong>123456</strong>.</p></div>
              )}
              {selectedMethod === 'vodafone' && (
                <div className="method-group"><p>Send payment to Vodafone Cash number: <strong>0100-XXXXXXX</strong></p></div>
              )}
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary btn-large">Confirm and Pay</button>
            </div>
          </form>
        </div>
      </main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Skill Bridge</h3>
            <p>Empowering learners worldwide with quality education and skills development.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/">Courses</Link></li>
              <li><Link to="/">Events</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Connect With Us</h3>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Skill Bridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default PaymentPage; 