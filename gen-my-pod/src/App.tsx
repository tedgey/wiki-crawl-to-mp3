import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './css/App.css';
import TopNav from './components/TopNav';
import ContentWrapper from './components/ContentWrapper';
import Generate from './components/pages/Generate';
import MyPods from './components/pages/MyPods';
import MediaPlayer from './components/MediaPlayer';
import HomePage from './components/pages/HomePage';
import TopicPage from './components/pages/TopicPage';
import NotFoundPage from './components/pages/NotFoundPage';

function App() {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const [mediaSource, setMediaSource] = useState<string>(''); // State for MediaPlayer's source

  const handleSignInSuccess = (credentialResponse: any) => {
    console.log('Sign in successful:', credentialResponse);
    setIsSignedIn(true);
  };

  const handleSignInFailure = () => {
    console.error('Sign in failed');
  };

  // Function to update the MediaPlayer source
  const updateMediaSource = (topic: string, subject: string) => {
    const source = `http://d31ask49tnw722.cloudfront.net/mp3s/${topic}/${subject}.mp3`;
    setMediaSource(source);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID"> {/* Replace with your Google Client ID */}
      <Router>
        {isSignedIn ? (
          <>
            <TopNav />
            <Routes>
              <Route
                path="/"
                element={<ContentWrapper><HomePage /></ContentWrapper>}
              />
              <Route
                path="/generate"
                element={<ContentWrapper><Generate /></ContentWrapper>}
              />
              <Route
                path="/my_pods"
                element={
                  <ContentWrapper>
                    <MyPods onMediaSourceUpdate={updateMediaSource} />
                  </ContentWrapper>
                }
              />
              <Route
                path="/global"
                element={<ContentWrapper><TopicPage /></ContentWrapper>}
              />
              <Route
                path="*"
                element={<ContentWrapper><NotFoundPage /></ContentWrapper>}
              />
            </Routes>
            <MediaPlayer source={mediaSource} />
          </>
        ) : (
          <>
            <h1>Gen My Pod</h1>
            <hr />
            <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="text-center">
                <h2>Welcome to Gen My Pod</h2>
                <p>Please sign in to continue</p>
              
              <GoogleLogin
                onSuccess={handleSignInSuccess}
                onError={handleSignInFailure}
              />
              </div>
            </div>
          </>
        )}
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;