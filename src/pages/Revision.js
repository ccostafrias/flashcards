import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../components/Modal';
import '../styles/Revision.css';

function Revision() {
  const { id } = useParams(); // ID do deck
  const [flashcards, setFlashcards] = useState([]);
  const [deck, setDeck] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Carregar flashcards e embaralhá-los
  useEffect(() => {
    // Carrega todos os decks
    const decks = JSON.parse(localStorage.getItem('decks')) || [];
    // Encontra o deck atual pelo id
    const currentDeck = decks.find(deck => deck.id.toString() === id);
    setDeck(currentDeck)
    // Extrai os flashcards do deck (ou define como array vazio se não houver)
    const cards = currentDeck?.flashcards || [];
    // Embaralha os flashcards usando uma cópia do array
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
  }, [id]);

  // Função para verificar resposta
  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;
    
    // Normalização para comparação
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = flashcards[currentIndex].answer.trim().toLowerCase();
    
    const correct = normalizedUserAnswer === normalizedCorrectAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setModalOpen(true);
  };

  // Função para lidar com a avaliação (fácil/médio/difícil)
  const handleEvaluate = (difficulty) => {
    // Aqui você pode atualizar os dados do flashcard para repetição espaçada,
    // por exemplo, definindo uma nova data de revisão baseada no feedback.
    
    // Após avaliação, prepara para o próximo flashcard
    setShowFeedback(false);
    setUserAnswer('');
    setModalOpen(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Se for o último flashcard, pode mostrar um resumo ou reiniciar a revisão
      alert("Revisão concluída!");
    }
  };

  if (flashcards.length === 0) {
    return <div className="revision"><p>Nenhum flashcard disponível para revisão.</p></div>;
  }

  return (
    <div className="revision">
      <h1>{deck.name}</h1>
      <div className="flashcard">
        <div className='nextcard-wrapper'>
            <button><span>{"<"}</span></button>
            <div>
              <p>
                <span>{currentIndex + 1}</span>
                /
                <span>{flashcards.length}</span>
              </p>
            </div>
            <button>{">"}</button>
        </div>
        <h2>{flashcards[currentIndex].question}</h2>
        {!showFeedback ? (
          <>
            <div className='answer-wrapper'>
              <input
                type="text"
                placeholder="Digite sua resposta"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              />
              <button onClick={handleSubmitAnswer}>{">"}</button>
            </div>
          </>
        ) : (
          <div className="feedback">
            <p>Sua resposta está {isCorrect ? 'Correta!' : 'Errada!'}</p>
            <p>
              <strong>Pergunta:</strong> {flashcards[currentIndex].question}
            </p>
            <p>
              <strong>Resposta:</strong> {flashcards[currentIndex].answer}
            </p>
          </div>
        )}
      </div>

      {/* Modal para avaliação: Fácil, Médio, Difícil */}
      <Modal isOpen={modalOpen} title="Avalie sua resposta" onClose={() => setModalOpen(false)}>
        <p>Como você classificaria esta revisão?</p>
        <div className="evaluation-buttons">
          <button onClick={() => handleEvaluate('fácil')}>Fácil</button>
          <button onClick={() => handleEvaluate('médio')}>Médio</button>
          <button onClick={() => handleEvaluate('difícil')}>Difícil</button>
        </div>
      </Modal>
    </div>
  );
}

export default Revision;