import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Layout from './components/Layout';
import { Home } from './components/Home';
import { Profile } from './components/Profile';
import { Register } from './components/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
      window.handleRoutes(['/', '/profile', '/register']);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
