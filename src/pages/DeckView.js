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

  const [selectedTags, setSelectedTags] = useState([]);
  const [filterReview, setFilterReview] = useState(false);
  const [filterFav, setFilterFav] = useState(false);

  // Simulando estatísticas
  const totalCards = deck?.flashcards?.length || 0;
  const lastReview = deck?.lastReview || "Nunca";
  const nextReview = deck?.nextReview || "Indefinido";
  const accuracy = deck?.correctAnswers
    ? Math.round((deck.correctAnswers / totalCards) * 100)
    : 0;

  // Função para alternar tags no filtro
  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  // Carregar dados do deck e dos flashcards do localStorage
  useEffect(() => {
    // Carregar deck
    const decks = JSON.parse(localStorage.getItem('decks')) || [];
    const foundDeck = decks.find((d) => d.id.toString() === id);
    setDeck(foundDeck);

    // Carregar flashcards do deck
    const savedFlashcards = foundDeck?.flashcards || [];  
    setFlashcards(savedFlashcards);
  }, [id]);

  useEffect(() => {
    const allTagsFiltered = [
      ...new Set(
        (JSON.parse(localStorage.getItem("decks")) || {})
          .flatMap(deck => deck.flashcards || []) // Pega todos os flashcards
          .flatMap(flashcard => flashcard.tags || []) // Pega todas as tags de cada flashcard
      )
    ]
    setAllTags(allTagsFiltered)
  }, [flashcardTags])

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
            { id: Date.now(), ...newFlashcard, tags: [...flashcardTags] },
          ];
          return { ...deck, flashcards: updatedFlashcards };
        }
        return deck;
      });
  
      // Salvar os decks atualizados no localStorage
      localStorage.setItem('decks', JSON.stringify(updatedDecks));
      setNewFlashcard({ question: '', answer: '' });
      setFlashcardTags([]);
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
        {/* <button className="settings-btn">⚙️ Configurações</button> */}
      </header>

      <section className="deck-view">
        <div className="deck-stats">
          <p><span>Total de Cards:</span> <span>{totalCards}</span></p>
          <p><span>Última Revisão:</span> <span>{lastReview}</span></p>
          <p><span>Próxima Revisão:</span> <span>{nextReview}</span></p>
          <p><span>% de Acertos:</span> <span>{accuracy}%</span></p>
        </div>
      </section>

      <section className='deckview-btns'>
        <button className="btn" onClick={() => {
            setIsModalOpen(true)
            setModalType("options")
          }}>
            Opções
        </button>
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
            <div className='modal--new-flashcard'>
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
              <TagInput
                tags={flashcardTags}
                setTags={setFlashcardTags}
                allTags={allTags}
              />

              <button className="modal--btn-add-flashcard" onClick={() => {
                handleAddFlashcard()
              }}>
                Adicionar Flashcard
              </button>
            </div>
          ) : modalType === "" ? (
            <div></div>
          ) : modalType === "options" ? (
            <div className='modal--options'>
              <h2>Opções</h2>
              <div className="deck-filters">
                <div className="deck-filters--tag">
                  <input 
                    type="checkbox" 
                    id="myTagCheckbox" 
                    className="custom-checkbox"
                    onChange={() => setFilterReview(!filterReview)}
                  />
                  <label htmlFor="myTagCheckbox" className="custom-checkbox-label">
                    Filtrar por Tags
                  </label>
                  <div className={`tag-filter ${filterReview ? "active" : ""}`}>
                    {allTags.map((tag) => (
                      <>
                        <button
                          key={tag}
                          className={selectedTags.includes(tag) ? "selected" : ""}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </button>
                        {/* <button onClick={() => setSelectedTags([])}>✖ Reset</button> */}
                      </>
                    ))}
                  </div>
                </div>
                <div className="deck-filters--fav">
                  <input 
                    type="checkbox" 
                    id="myFavCheckbox" 
                    className="custom-checkbox"
                    onChange={() => setFilterFav(!filterFav)}
                  />
                  <label htmlFor="myFavCheckbox" className="custom-checkbox-label">
                    Filtrar por Favoritos
                  </label>
                </div>
              </div>
            </div>
          ) : null}
        </Modal>
    </div>
  );
}

export default DeckView;