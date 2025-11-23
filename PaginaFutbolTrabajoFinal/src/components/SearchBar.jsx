import React from 'react';
import '../styles/layout.css'; // Usaremos estilos generales por ahora

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-container" style={{ margin: '20px 0' }}>
      <input
        type="text"
        className="search-input"
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '10px',
          width: '100%',
          maxWidth: '400px',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />
      {searchTerm && (
        <button 
          onClick={() => setSearchTerm('')}
          style={{ marginLeft: '10px', padding: '10px', cursor: 'pointer' }}
        >
          Limpiar
        </button>
      )}
    </div>
  );
};

export default SearchBar;