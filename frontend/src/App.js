//import logo from './logo.svg';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Main from './pages/Main';
import Taskleiste from './Taskleiste';
import TaskleisteLogin from './TaskleisteLogin';  
import './App.css';


const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <>
      {isLoginPage ? <TaskleisteLogin /> : <Taskleiste />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;