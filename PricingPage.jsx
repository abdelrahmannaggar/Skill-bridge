import React from 'react';
import { Link } from 'react-router-dom';
import './PricingPage.css';

function PricingPage() {
  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1>Unlock Your Potential</h1>
        <p className="subheader">Flexible Pricing for Every Ambition</p>
      </div>

      <div className="pricing-grid">
        {/* Starter Plan */}
        <article className="plan-card">
          <div className="plan-icon">🚀</div>
          <h3>Starter</h3>
          <div className="price">$0<span>/month</span></div>
          <p className="plan-description">Perfect for exploring basics</p>
          <ul className="plan-features">
            <li>✅ 3 Skill Swaps monthly</li>
            <li>✅ 1 Guided Tutorial</li>
            <li>✅ Priority Email Support</li>
            <li>✅ Basic Resource Library</li>
          </ul>
          <Link to="/payment" className="cta-button free-cta">Start Free Trial →</Link>
        </article>

        {/* Pro Plan */}
        <article className="plan-card pro">
          <div className="plan-icon">🌟</div>
          <h3>Pro</h3>
          <div className="price">$35<span>/month</span></div>
          <p className="plan-description">For serious skill accelerators</p>
          <ul className="plan-features">
            <li>✅ 7-10 Skill Swaps monthly</li>
            <li>✅ 5 Expert-Led Tutorials</li>
            <li>✅ VIP Priority Support</li>
            <li>✅ Community Forum Access</li>
            <li>✅ Progress Analytics</li>
            <li>🎁 Free Annual Webinar Pass</li>
          </ul>
          <Link to="/payment" className="cta-button pro-cta">Choose Plan →</Link>
        </article>

        {/* Elite Plan */}
        <article className="plan-card">
          <div className="plan-icon">💎</div>
          <h3>Elite</h3>
          <div className="price">$50<span>/month</span></div>
          <p className="plan-description">Ultimate growth experience</p>
          <ul className="plan-features">
            <li>✅ Unlimited Skill Swaps</li>
            <li>✅ 10+ Premium Tutorials</li>
            <li>✅ 1-on-1 Mentoring</li>
            <li>✅ Exclusive Mastermind Groups</li>
            <li>✅ Early Feature Access</li>
            <li>🎁 Free Certification Program</li>
          </ul>
          <Link to="/payment" className="cta-button free-cta">Get Premium →</Link>
        </article>
      </div>

      <div className="trust-badges">
        <span>🔒 30-Day Guarantee</span>
        <span>🕒 24/7 Support</span>
        <span>🔄 Flexible Upgrades</span>
      </div>
    </div>
  );
}

export default PricingPage; 