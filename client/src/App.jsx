import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import QRPage from './pages/QRPage';

import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/qr/:id" element={<QRPage />} />
      </Routes>
    </Router>
  );
}

export default App;
