import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <Link to="/">
        <h1>Flashcards</h1>
      </Link>
      <nav className="nav-links">
        <Link to="/statistics">Estatísticas</Link>
        <Link to="/panels">Painel</Link>
      </nav>
    </header>
  );
}

export default Header;
