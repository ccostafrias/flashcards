// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importando ícones

function Home() {
  const [decks, setDecks] = useState([]);
  const [newDeckName, setNewDeckName] = useState('');
  const [editingDeck, setEditingDeck] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [modalType, setModalType] = useState(""); // "create", "edit", "delete"

  // Carregar decks do localStorage ao iniciar
  useEffect(() => {
    const savedDecks = JSON.parse(localStorage.getItem('decks')) || [];
    setDecks(savedDecks);
  }, []);

  // Criar um novo deck
  const handleCreateDeck = () => {
    const duplicatedName = decks.some((deck) => deck.name === newDeckName)
    if (duplicatedName) return;
    if (!newDeckName.trim()) return; // Evita criar decks vazios

    const newDeck = { id: Date.now(), name: newDeckName };
    const updatedDecks = [...decks, newDeck];

    setDecks(updatedDecks);
    localStorage.setItem('decks', JSON.stringify(updatedDecks));
    setNewDeckName('');
    setIsModalOpen(false);
  };

  // Deletar um deck
  const handleDeleteDeck = () => {
    const id = selectedDeck?.id
    const updatedDecks = decks.filter((deck) => deck.id !== id);
    setDecks(updatedDecks);
    localStorage.setItem('decks', JSON.stringify(updatedDecks));
    closeModal()
  };

  // Abrir modal de edição
  const handleOpenEditModal = (deck) => {
    setEditingDeck(deck);
    setNewDeckName(deck.name);
    setIsModalOpen(true);
    setModalType("edit")
  };

    // Abrir modal de deleção
    const handleOpenDeleteModal = (deck) => {
      setEditingDeck(deck);
      setNewDeckName(deck.name);
      setIsModalOpen(true);
      setModalType("delete")
      setSelectedDeck(deck)
    };

  // Salvar a edição do deck
  const handleRenameDeck = () => {
    const duplicatedName = decks.some((deck) => deck.name === newDeckName)
    if (duplicatedName) return;
    if (!newDeckName.trim()) return;

    const updatedDecks = decks.map((deck) =>
      deck.id === editingDeck.id ? { ...deck, name: newDeckName } : deck
    );

    setDecks(updatedDecks);
    localStorage.setItem('decks', JSON.stringify(updatedDecks));
    setIsModalOpen(false);
    setEditingDeck(null);
    setNewDeckName('');
  };

    // Abrir Modal Específico
    const openModal = (type, deck = null) => {
      setModalType(type);
      setSelectedDeck(deck);
      setIsModalOpen(true);
    };
  
    // Fechar Modal
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedDeck(null);
      setNewDeckName("");
    };

  return (
    <div className="home">
      <h1>Meus Decks</h1>

      {/* Exibir mensagem se não houver decks */}
      {decks.length === 0 ? (
        <p className="no-decks-message">Nenhum deck encontrado. Crie um novo!</p>
      ) : (
        <ul className="deck-list">
          {decks.map((deck) => (
            <li key={deck.id} className="deck-item">
              <Link to={`/deck/${deck.id}`} className="deck-link">
                {deck.name}
              </Link>
              <div className="deck-actions">
                <button className="btn-edit" onClick={() => handleOpenEditModal(deck)}>
                  <FaEdit className='icon-edit'/>
                </button>
                <button className="btn-delete" onClick={() => handleOpenDeleteModal(deck)}>
                  <FaTrash className='icon-delete'/>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Botão para abrir modal de criação */}
      <button className="btn-criar-deck" onClick={() => {
        setIsModalOpen(true)
        setModalType("create")
      }}>
        Criar Novo Deck
      </button>

      {/* Modal Reutilizável */}
      <Modal isOpen={isModalOpen} title={modalType === "delete" ? "Confirmar Exclusão" : modalType === "edit" ? "Renomear Deck" : "Criar Novo Deck"} onClose={closeModal}>
        {modalType === "create" || modalType === "edit" ? (
          <div>
            <h2>{modalType === "edit" ? "Renomear Deck" : "Criar Novo Deck"}</h2>
            <input type="text" placeholder="Nome do deck" value={newDeckName} onChange={(e) => setNewDeckName(e.target.value)} />
            <button className='modal-button' onClick={modalType === "create" ? handleCreateDeck : handleRenameDeck}>
              {modalType === "create" ? "Criar" : "Renomear"}
            </button>
          </div>
        ) : modalType === "delete" ? (
          <div className='modal-delete'>
            <h2>Você tem certeza?</h2>
            <p>Tem certeza que deseja excluir o deck <strong>"{selectedDeck?.name}"</strong>?</p>
            <div className="modal-buttons">
              <button className="modal-button" onClick={closeModal}>Cancelar</button>
              <button className="modal-button modal--delete-button" onClick={handleDeleteDeck}>Excluir</button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

export default Home;
