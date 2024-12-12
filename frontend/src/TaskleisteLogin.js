import React from 'react';
import './Taskleiste.css';
import logo from './LogoComment.png';

const Taskleiste = () => {



  return (
    <nav className="taskleiste">
    <ul className="taskleiste-list">
      
        <li className="taskleiste-title">
          <img src={logo} alt="Echo" className="logo-image" />
        </li>
    </ul>
  </nav>
  );
}

export default Taskleiste;