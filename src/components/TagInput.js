// src/components/TagInput.js
import React, { useState, useEffect } from 'react';
import '../styles/TagInput.css';

function TagInput({ tags, setTags, allTags, setAllTags }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Atualiza as sugestões filtrando as tags já existentes (allTags)
  useEffect(() => {
    if (inputValue.trim() === '') {
      setSuggestions([]);
    } else {
      const filtered = allTags.filter(tag =>
        tag.toLowerCase().includes(inputValue.toLowerCase()) &&
        !tags.includes(tag)
      );
      setSuggestions(filtered);
    }
  }, [inputValue, allTags, tags]);

  const handleAddTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed !== '' && !tags.includes(trimmed)) {
      // Atualiza a lista de tags do flashcard
      setTags([...tags, trimmed]);
      // Adiciona à lista global de tags se ainda não existir
      if (!allTags.includes(trimmed)) {
        setAllTags([...allTags, trimmed]);
      }
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="tag-input-container">
      <div className="tag-input-row">
        <input
          type="text"
          placeholder="Digite uma tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleAddTag} className="btn-add-tag">+</button>
      </div>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {tags.length > 0 && (
        <div className="tags-container">
          {tags.map((tag, index) => (
            <div key={index} className="tag-item">
              {tag}
              <span className="remove-tag" onClick={() => handleRemoveTag(tag)}>x</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TagInput;