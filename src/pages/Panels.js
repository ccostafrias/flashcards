// src/pages/Paineis.js
import React, { useState, useEffect } from 'react';
import PanelDeck from '../components/PanelDeck';
// import '../styles/Panels.css';

function Panels() {
  const [decks, setDecks] = useState([]);

  // Carregar todos os decks do localStorage
  useEffect(() => {
    const savedDecks = JSON.parse(localStorage.getItem('decks')) || [];
    setDecks(savedDecks);
  }, []);

  // Função para atualizar os decks (após edição ou exclusão)
  const updateDecks = (updatedDecks) => {
    setDecks(updatedDecks);
    localStorage.setItem('decks', JSON.stringify(updatedDecks));
  };

  return (
    <div className="paineis">
      <h1>Painéis de Decks</h1>
      <div className="deck-list">
        {decks.length === 0 ? (
          <p>Nenhum deck encontrado.</p>
        ) : (
          decks.map(deck => (
            <PanelDeck key={deck.id} deck={deck} updateDecks={updateDecks} />
          ))
        )}
      </div>
    </div>
  );
}

export default Panels;