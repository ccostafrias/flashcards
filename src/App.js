import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import DeckView from './pages/DeckView';
import Revision from './pages/Revision';
import Statistics from './pages/Statistics';
import './styles/global.css';
import Panels from './pages/Panels';

function App() {
  return (
    <Router> {/* Router é usado para naveção por links, o que deixa mais fluído */}
        <Header />
        <main>
          <Routes>
            <Route index element={<Home />} /> {/* index define essa Route como a principal */}
            <Route path="/deck/:id" element={<DeckView />} />
            <Route path="/revision" element={<Revision />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/revision/:id" element={<Revision />} />
            <Route path="/panels" element={<Panels />} />
          </Routes>
        </main>
    </Router>
  );
}

export default App;