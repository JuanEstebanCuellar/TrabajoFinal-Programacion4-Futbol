import React from 'react';
import './PlayerRow.css';

const PlayerRow = ({ 
  player, 
  index, 
  onClick, 
  isFavorite, 
  onToggleFavorite, 
  darkMode, 
  colorClass 
}) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(player.id);
  };

  return (
    <tr 
      className={`player-row ${colorClass} ${darkMode ? 'player-row--dark' : ''}`}
      onClick={() => onClick(player)}
    >
      <td className="player-row__cell player-row__cell--favorite">
        <button 
          className="player-row__favorite-btn"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </td>
      <td className="player-row__cell">{player.nombre}</td>
      <td className="player-row__cell">{player.club}</td>
      <td className="player-row__cell">{player.posicion}</td>
      <td className="player-row__cell">{player.pais}</td>
      <td className="player-row__cell">{player.edad}</td>
      <td className="player-row__cell">{player.goles}</td>
      <td className="player-row__cell">{player.asistencias}</td>
    </tr>
  );
};

export default PlayerRow;
