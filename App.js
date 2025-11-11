import './App.css';
import '../../frontend/css/style22.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ProfilePage from './components/ProfilePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AboutUsPage from './components/AboutUsPage';
import ContactUsPage from './components/ContactUsPage';
import PaymentPage from './components/PaymentPage';
import SkillSwapPage from './components/SkillSwapPage';
import PricingPage from './components/PricingPage';
import OnlineTutorialRequestPage from './components/OnlineTutorialRequestPage';
import OnlineTutorialPage from './components/OnlineTutorialPage';
import RequiredSkillPage from './components/RequiredSkillPage';
import PersonalSkillPage from './components/PersonalSkillPage';
import SettingsPage from './components/SettingsPage';
import EventPage from './components/EventPage';
import ChatsPage from './components/ChatsPage';
import InterestsPage from './components/InterestsPage';
import { ErrorBoundary } from 'react-error-boundary';

// Error Fallback Component
function ErrorFallback({error}) {
  return (
    <div role="alert" className="error-container">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

// 404 Page Component
function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/skillswap" element={<SkillSwapPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/online-tutorial-request" element={<OnlineTutorialRequestPage />} />
          <Route path="/online-tutorial" element={<OnlineTutorialPage />} />
          <Route path="/required-skill" element={<RequiredSkillPage />} />
          <Route path="/personal-skill" element={<PersonalSkillPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/chats" element={<ChatsPage />} />
          <Route path="/interests" element={<InterestsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
