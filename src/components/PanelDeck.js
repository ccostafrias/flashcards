// src/components/PainelDeck.js
import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Modal from './Modal'; // Supondo que já temos um componente Modal reutilizável
import '../styles/PanelDeck.css';

function PanelDeck({ deck, updateDecks }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(deck.name);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [newFlashcard, setNewFlashcard] = useState({ question: '', answer: '' });
  
  // Atualiza o título do deck
  const handleUpdateTitle = () => {
    if (newTitle.trim()) {
      const updatedDeck = { ...deck, name: newTitle };
      updateDeckInStorage(updatedDeck);
      setIsEditingTitle(false);
    }
  };

  // Excluir deck
  const handleDeleteDeck = () => {
    // Confirmação poderia ser adicionada aqui
    const allDecks = JSON.parse(localStorage.getItem('decks')) || [];
    const updatedDecks = allDecks.filter(d => d.id !== deck.id);
    updateDecks(updatedDecks);
  };

  // Adicionar flashcard
  const handleAddFlashcard = () => {
    if (newFlashcard.question.trim() && newFlashcard.answer.trim()) {
      const updatedFlashcards = deck.flashcards
        ? [...deck.flashcards, { id: Date.now(), ...newFlashcard }]
        : [{ id: Date.now(), ...newFlashcard }];
      const updatedDeck = { ...deck, flashcards: updatedFlashcards };
      updateDeckInStorage(updatedDeck);
      setNewFlashcard({ question: '', answer: '' });
      setIsFlashcardModalOpen(false);
    }
  };

  // Atualiza o deck no localStorage e chama updateDecks para atualizar o estado
  const updateDeckInStorage = (updatedDeck) => {
    const allDecks = JSON.parse(localStorage.getItem('decks')) || [];
    const updatedDecks = allDecks.map(d => (d.id === updatedDeck.id ? updatedDeck : d));
    updateDecks(updatedDecks);
  };

  return (
    <div className="painel-deck">
      <div className="deck-header">
        {isEditingTitle ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            autoFocus
          />
        ) : (
          <h2 onClick={() => setIsEditingTitle(true)}>{deck.name}</h2>
        )}
        <div className="deck-actions">
          <button onClick={() => setIsEditingTitle(true)}>
            <FaEdit />
          </button>
          <button onClick={handleDeleteDeck}>
            <FaTrash />
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Fechar' : 'Abrir'}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="flashcards-panel">
          {deck.flashcards && deck.flashcards.length > 0 ? (
            <ul>
              {deck.flashcards.map(flashcard => (
                <li key={flashcard.id}>
                  <strong>{flashcard.question}</strong> - {flashcard.answer}
                  {/* Botões de editar/excluir flashcard podem ser adicionados aqui */}
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum flashcard no deck.</p>
          )}
          <button className="btn-add-flashcard" onClick={() => setIsFlashcardModalOpen(true)}>
            <FaPlus /> 
            <p>Adicionar Flashcard</p>
          </button>
        </div>
      )}
      {/* Modal para adicionar flashcard */}
      <Modal isOpen={isFlashcardModalOpen} title="Novo Flashcard" onClose={() => setIsFlashcardModalOpen(false)}>
        <input
          type="text"
          placeholder="Pergunta"
          value={newFlashcard.question}
          onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })}
        />
        <input
          type="text"
          placeholder="Resposta"
          value={newFlashcard.answer}
          onChange={(e) => setNewFlashcard({ ...newFlashcard, answer: e.target.value })}
        />
        <button onClick={handleAddFlashcard}>Adicionar</button>
      </Modal>
    </div>
  );
}

export default PanelDeck;