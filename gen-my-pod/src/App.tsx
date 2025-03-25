import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './css/App.css';
import TopNav from './components/TopNav';
import ContentWrapper from './components/ContentWrapper';
import Generate from './components/pages/Generate';
import MyPods from './components/pages/MyPods';
import HomePage from './components/pages/HomePage';
import TopicPage from './components/pages/TopicPage';
import NotFoundPage from './components/pages/NotFoundPage';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(true);

  const handleSignInSuccess = (credentialResponse: any) => {
    console.log('Sign in successful:', credentialResponse);
    setIsSignedIn(true);
  };

  const handleSignInFailure = () => {
    console.error('Sign in failed');
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID"> {/* Replace with your Google Client ID */}
      <Router>
        {isSignedIn ? (
          <>
            <TopNav />
            <Routes>
              <Route path="/" element={<ContentWrapper><HomePage /></ContentWrapper>} />
              <Route path="/generate" element={<ContentWrapper><Generate /></ContentWrapper>} />
              <Route path="/my_pods" element={<ContentWrapper><MyPods /></ContentWrapper>} />
              <Route path="/topic/:id" element={<ContentWrapper><TopicPage /></ContentWrapper>} />
              <Route path="*" element={<ContentWrapper><NotFoundPage /></ContentWrapper>} />
            </Routes>
          </>
        ) : (
          <>
            <h1>Gen My Pod</h1>
            <p className="read-the-docs">
              Sign in to get started
            </p>
            <GoogleLogin
              onSuccess={handleSignInSuccess}
              onError={handleSignInFailure}
            />
          </>
        )}
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;