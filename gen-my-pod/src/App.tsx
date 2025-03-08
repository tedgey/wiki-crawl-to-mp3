import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './css/App.css';
import TopNav from './components/TopNav';
import Content from './components/Content';

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
            <Content />
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