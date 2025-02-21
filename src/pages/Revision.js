import { useParams } from 'react-router-dom';

function Revision() {
  const { id } = useParams();

  return (
    <div>
      <h1>Revisão do Deck {id}</h1>
      <p>Aqui aparecerão os flashcards para revisar.</p>
    </div>
  );
}

export default Revision;
