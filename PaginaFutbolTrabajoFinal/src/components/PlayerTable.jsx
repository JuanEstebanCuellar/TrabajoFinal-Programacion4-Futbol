import React from 'react';
import '../styles/table.css'; // Importamos los estilos específicos de la tabla

const PlayerTable = ({ players }) => {
  
  // Validación: Si no hay jugadores (por el filtro), mostramos mensaje
  if (!players || players.length === 0) {
    return (
      <div className="no-results">
        <p>🚫 No se encontraron jugadores con ese nombre.</p>
      </div>
    );
  }

  // Función auxiliar para asignar color según la posición (UI/UX)
  const getPositionClass = (position) => {
    const pos = position.toLowerCase();
    if (pos.includes('delantero')) return 'badge--forward';
    if (pos.includes('mediocampista')) return 'badge--midfielder';
    if (pos.includes('defensa')) return 'badge--defender';
    if (pos.includes('portero')) return 'badge--goalkeeper';
    return 'badge--default';
  };

  return (
    <div className="table-container">
      <table className="player-table">
        <thead className="player-table__head">
          <tr>
            <th className="player-table__th">ID</th>
            <th className="player-table__th">Jugador</th>
            <th className="player-table__th">Club</th>
            <th className="player-table__th">Posición</th>
            <th className="player-table__th">País</th>
            <th className="player-table__th center">Edad</th>
            <th className="player-table__th center">Goles</th>
            <th className="player-table__th center">Rating</th>
          </tr>
        </thead>
        <tbody className="player-table__body">
          {players.map((player) => (
            <tr key={player.id} className="player-table__row">
              <td className="player-table__td identifier">#{player.id}</td>
              
              <td className="player-table__td font-bold">
                {player.name}
              </td>
              
              <td className="player-table__td">
                {player.club}
              </td>
              
              <td className="player-table__td">
                <span className={`badge ${getPositionClass(player.position)}`}>
                  {player.position}
                </span>
              </td>
              
              <td className="player-table__td">
                {player.country}
              </td>
              
              <td className="player-table__td center">{player.age}</td>
              <td className="player-table__td center">{player.goals}</td>
              
              <td className="player-table__td center rating-cell">
                <span className="rating-box">{player.rating}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;