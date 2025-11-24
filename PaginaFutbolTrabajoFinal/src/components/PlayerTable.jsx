import React from 'react';

function PlayerTable({ players, onSort, rowColors, favorites, onToggleFavorite, onRowClick }) {
  if (!players || players.length === 0) {
    return React.createElement('div', { className: 'player-table-empty' }, 'No hay jugadores para mostrar');
  }

  var columns = ['nombre', 'club', 'posicion', 'pais', 'edad', 'goles', 'asistencias', 'rating'];

  return (
    React.createElement('div', { className: 'player-table-container' },
      React.createElement('table', { className: 'player-table' },
        React.createElement('thead', null,
          React.createElement('tr', null,
            React.createElement('th', { 'data-index': '0' }, 'FAV'),
            columns.map(function(col, idx) {
              return React.createElement('th', { key: col, onClick: function() { onSort(col); }, className: 'sortable', 'data-index': String(idx + 1) }, col.toUpperCase());
            })
          )
        ),
        React.createElement('tbody', null,
          players.map(function(player, idx) {
            var rowClass = '';
            if (rowColors === 'pares' && idx % 2 === 0) rowClass = 'row-colored';
            if (rowColors === 'impares' && idx % 2 !== 0) rowClass = 'row-colored';
            
            return React.createElement('tr', { key: player.id, className: rowClass, onClick: function() { onRowClick(player); } },
              React.createElement('td', null,
                React.createElement('button', {
                  className: 'favorite-btn ' + (favorites.includes(player.id) ? 'active' : ''),
                  onClick: function(e) { e.stopPropagation(); onToggleFavorite(player.id); }
                }, '⭐')
              ),
              React.createElement('td', null, player.nombre),
              React.createElement('td', null, player.club),
              React.createElement('td', null, player.posicion),
              React.createElement('td', null, player.pais),
              React.createElement('td', null, player.edad),
              React.createElement('td', null, player.goles),
              React.createElement('td', null, player.asistencias),
              React.createElement('td', null, player.rating)
            );
          })
        )
      )
    )
  );
}

export default PlayerTable;
