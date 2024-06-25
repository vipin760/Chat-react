import React, { useState } from 'react'
import "./Header.css"
const Header = () => {

  const [isActive, setIsActive] = useState(false);

  const handleMenuClick = () => {
    setIsActive(!isActive);
  };

  const handleScroll = () => {
    setIsActive(false);
  };
  return (
    <header className="header">
        <a href="" className="logo"> <i className="fas fa-message"></i>FreeChat</a>
        <nav className={`navbar ${isActive ? 'active' : ''}`}>
            <a href="/home">Home</a>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
            <a href="#book">Book</a>
            <a href="#blog">Blog</a>
        </nav>
        <div id="menu-btn" className={`fa ${isActive ? 'fa-times' : 'fa-bars'}`} onClick={handleMenuClick}></div>
    </header>
  )
}

export default Header
