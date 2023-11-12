// Routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import AnimeDetail from './AnimeDetail';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/anime/:animeLabel" element={<AnimeDetail />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
