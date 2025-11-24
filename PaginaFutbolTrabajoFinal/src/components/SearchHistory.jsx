import React from 'react';

function SearchHistory({ history, onSelect, onClear }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="search-history">
      <p className="search-history-label">Historial:</p>
      <div className="search-history-list">
        {history.map((term, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(term)}
            className="search-history-item"
          >
            {term}
          </button>
        ))}
      </div>
      <button onClick={onClear} className="search-history-clear">Limpiar</button>
    </div>
  );
}

export default SearchHistory;
