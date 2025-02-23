// src/pages/DeckView.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Modal from '../components/Modal';
import TagInput from '../components/TagInput';
import '../styles/DeckView.css';

function DeckView() {
  const { id } = useParams(); // id do deck a partir da URL
  const navigate = useNavigate()
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [newFlashcard, setNewFlashcard] = useState({ question: '', answer: '' });
  const [flashcardTags, setFlashcardTags] = useState([]);
  const [allTags, setAllTags] = useState([])


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "delete"

  // Carregar dados do deck e dos flashcards do localStorage
  useEffect(() => {
    // Carregar deck
    const decks = JSON.parse(localStorage.getItem('decks')) || [];
    const foundDeck = decks.find((d) => d.id.toString() === id);
    setDeck(foundDeck);

    // Carregar flashcards do deck
    const savedFlashcards = foundDeck?.flashcards || [];
    const tags = decks?.flashcards?.tags
    setFlashcards(savedFlashcards);
  }, [id]);

  useEffect(() => {
    console.log()
  }, [flashcards])

  // Adicionar um novo flashcard
  const handleAddFlashcard = () => {
    if (newFlashcard.question.trim() && newFlashcard.answer.trim()) {
      // Carregar os decks do localStorage
      const decks = JSON.parse(localStorage.getItem('decks')) || [];
      
      // Encontrar o deck atual
      const updatedDecks = decks.map((deck) => {
        if (deck.id.toString() === id) {
          const updatedFlashcards = [
            ...(deck.flashcards || []),
            { id: Date.now(), ...newFlashcard },
          ];
          return { ...deck, flashcards: updatedFlashcards };
        }
        return deck;
      });
  
      // Salvar os decks atualizados no localStorage
      localStorage.setItem('decks', JSON.stringify(updatedDecks));
      setNewFlashcard({ question: '', answer: '' });
      setIsModalOpen(false);
      setModalType("");
      
      // Se você também mantém o estado local para flashcards, atualize-o:
      setFlashcards(prev => [...prev, { id: Date.now(), ...newFlashcard }]);
    }
  };

  // Excluir um flashcard
  const handleDeleteFlashcard = (flashcardId) => {
    const updatedFlashcards = flashcards.filter(card => card.id !== flashcardId);
    setFlashcards(updatedFlashcards);
    
    const decks = JSON.parse(localStorage.getItem('decks')) || [];
    const updatedDecks = decks.map((deck) => {
      if (deck.id.toString() === id) {
        return { ...deck, flashcards: updatedFlashcards };
      }
      return deck;
    });
    localStorage.setItem('decks', JSON.stringify(updatedDecks));
  };
  
  // Fechar Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="deck-view">
      <header className="deck-header">
        {/* <Link to="/" className="back-link">← Voltar</Link> */}
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

      <section className='deckview-btns'>
        <button className="btn" onClick={() => {
          setIsModalOpen(true)
          setModalType("create")
        }}>
          Criar Flashcard
        </button>
        <button className='btn' disabled={!flashcards.length} onClick={() => {
          navigate(`/revision/${id}`)
        }}>
          Iniciar Revisão
        </button>
      </section>
        {/* Modal Reutilizável */}
        <Modal isOpen={isModalOpen} title={modalType === "delete" ? "Confirmar Exclusão" : modalType === "edit" ? "Renomear Deck" : "Criar Novo Deck"} onClose={closeModal}>
          {modalType === "create" ? (
            <div>
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
              {/* <input
                type="text"
                placeholder="Tags (separadas por vírgula)"
                value={newFlashcardTags}
                onChange={(e) => setNewFlashcardTags(e.target.value)}
              /> */}
              <TagInput
                tags={flashcardTags}
                setTags={setFlashcardTags}
                allTags={allTags}
                setAllTags={setAllTags}
              />

              <button className="btn-add-flashcard" onClick={() => {
                handleAddFlashcard()
              }}>
                Adicionar Flashcard
              </button>
            </div>
          ) : modalType === "" ? (
            <div></div>
          ) : null}
        </Modal>
    </div>
  );
}

export default DeckView;