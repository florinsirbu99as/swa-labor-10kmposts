import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { Home as HomeIcon, ExitToApp as LogoutIcon,  AccountCircle as LogoIcon } from '@mui/icons-material';
import './Taskleiste.css';
import logo from './LogoComment.png';


const Taskleiste = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('username'); 
    navigate("/");
  };

  return (
    <nav className="taskleiste">
    <ul className="taskleiste-list">
      <li className="taskleiste-item">
        <Link to="/">
        <li className="taskleiste-title">
          <img src={logo} alt="Echo" className="logo-image" />
        </li>
        </Link>
      </li>
      <li className="taskleiste-item">
        <Link to="/home">
          <IconButton>
            <HomeIcon />
          </IconButton>
        </Link>
      </li>
      <li className="taskleiste-item">
        <IconButton onClick={handleLogout}>
          <LogoutIcon />
        </IconButton>
      </li>
      
    </ul>
  </nav>
  );
}

export default Taskleiste;
