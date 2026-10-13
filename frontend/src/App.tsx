import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import FileUpload from './FileUpload';
import FileDownload from './FileDownload';
import './App.css';
import LandingPage from './LandingPage';

const ScrollToTopOnRoute: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      let attempts = 0;
      const maxAttempts = 20;

      const attemptScroll = () => {
        const elem = document.getElementById(id);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(attemptScroll, 50);
        }
      };

      const timer = setTimeout(attemptScroll, 50);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTopOnRoute />
      <div>
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<FileUpload />} />
            <Route path="/download" element={<FileDownload />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;