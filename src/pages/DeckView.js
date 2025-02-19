// src/pages/DeckView.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/DeckView.css';

function DeckView() {
  const { id } = useParams(); // id do deck a partir da URL
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [newFlashcard, setNewFlashcard] = useState({ question: '', answer: '' });

  // Carregar dados do deck e dos flashcards do localStorage
  useEffect(() => {
    // Carregar deck
    const decks = JSON.parse(localStorage.getItem('decks')) || [];
    const foundDeck = decks.find((d) => d.id.toString() === id);
    setDeck(foundDeck);

    // Carregar flashcards do deck
    const savedFlashcards = JSON.parse(localStorage.getItem(`flashcards_${id}`)) || [];
    setFlashcards(savedFlashcards);
  }, [id]);

  // Adicionar um novo flashcard
  const handleAddFlashcard = () => {
    if (newFlashcard.question.trim() && newFlashcard.answer.trim()) {
      const updatedFlashcards = [
        ...flashcards,
        { id: Date.now(), ...newFlashcard },
      ];
      setFlashcards(updatedFlashcards);
      localStorage.setItem(`flashcards_${id}`, JSON.stringify(updatedFlashcards));
      setNewFlashcard({ question: '', answer: '' });
    }
  };

  // Excluir um flashcard
  const handleDeleteFlashcard = (flashcardId) => {
    const updatedFlashcards = flashcards.filter(card => card.id !== flashcardId);
    setFlashcards(updatedFlashcards);
    localStorage.setItem(`flashcards_${id}`, JSON.stringify(updatedFlashcards));
  };

  return (
    <div className="deck-view">
      <header className="deck-header">
        <Link to="/" className="back-link">← Voltar</Link>
        <h1>{deck ? deck.name : 'Deck não encontrado'}</h1>
      </header>

      <section className="flashcards-section">
        {flashcards.length === 0 ? (
          <p className="no-flashcards-message">Nenhum flashcard neste deck. Adicione um novo!</p>
        ) : (
          <ul className="flashcards-list">
            {flashcards.map((card) => (
              <li key={card.id} className="flashcard-item">
                <h3 className="flashcard-question">{card.question}</h3>
                <p className="flashcard-answer">{card.answer}</p>
                <button className="btn-delete-flashcard" onClick={() => handleDeleteFlashcard(card.id)}>
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="new-flashcard-section">
        <h2>Novo Flashcard</h2>
        <input
          type="text"
          placeholder="Pergunta"
          value={newFlashcard.question}
          onChange={(e) =>
            setNewFlashcard({ ...newFlashcard, question: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Resposta"
          value={newFlashcard.answer}
          onChange={(e) =>
            setNewFlashcard({ ...newFlashcard, answer: e.target.value })
          }
        />
        <button className="btn-add-flashcard" onClick={handleAddFlashcard}>
          Adicionar Flashcard
        </button>
      </section>
    </div>
  );
}

export default DeckView;