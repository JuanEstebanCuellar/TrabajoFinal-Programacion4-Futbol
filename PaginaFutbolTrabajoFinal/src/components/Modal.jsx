import React from 'react';

function Modal({ isOpen, onClose, player, darkMode }) {
  if (!isOpen || !player) return null;

  return (
    <div className={'modal-overlay ' + (darkMode ? 'modal--dark' : '')} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>{player.nombre}</h2>
        <p><strong>Club:</strong> {player.club}</p>
        <p><strong>Posición:</strong> {player.posicion}</p>
        <p><strong>País:</strong> {player.pais}</p>
        <p><strong>Edad:</strong> {player.edad}</p>
        <p><strong>Goles:</strong> {player.goles}</p>
        <p><strong>Asistencias:</strong> {player.asistencias}</p>
        <p><strong>Rating:</strong> {player.rating}</p>
      </div>
    </div>
  );
}

export default Modal;
