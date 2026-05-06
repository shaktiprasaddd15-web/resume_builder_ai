import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Toast from './components/Toast';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Builder from './pages/Builder';
import History from './pages/History';
import About from './pages/About';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/builder" element={
          <PrivateRoute><Builder /></PrivateRoute>
        } />
        <Route path="/history" element={
          <PrivateRoute><History /></PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  );
}

export default App;
