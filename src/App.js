// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import BulletinBoard from './pages/BulletinBoard';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bulletin" element={<BulletinBoard />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;