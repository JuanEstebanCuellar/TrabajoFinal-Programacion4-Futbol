import React from 'react';
import SearchHistory from './SearchHistory';

function ControlPanel({ stats, favorites, rowColors, setRowColors, searchHistory, setSearchHistory, setSearchTerm }) {
  return (
    React.createElement('div', { className: 'main-panel' },
      React.createElement('div', { className: 'left-panel' },
        React.createElement('div', { className: 'stats-compact' },
          React.createElement('div', { className: 'stat-compact-item' },
            React.createElement('p', { className: 'stat-compact-label' }, 'JUGADORES EN TABLA'),
            React.createElement('p', { className: 'stat-compact-value' }, stats.total),
            React.createElement('p', { className: 'stat-compact-sub' }, 'Favoritos: ' + favorites.length)
          )
        ),
        React.createElement('div', { className: 'filter-buttons' },
          React.createElement('button', { 
            className: 'btn-filter ' + (rowColors === 'pares' ? 'active' : ''),
            onClick: function() { setRowColors(rowColors === 'pares' ? 'none' : 'pares'); }
          }, 'Pintar filas pares'),
          React.createElement('button', {
            className: 'btn-filter ' + (rowColors === 'impares' ? 'active' : ''),
            onClick: function() { setRowColors(rowColors === 'impares' ? 'none' : 'impares'); }
          }, 'Pintar filas impares'),
          React.createElement('button', {
            className: 'btn-filter',
            onClick: function() { setRowColors('none'); }
          }, 'Limpiar color')
        )
      ),

      React.createElement('div', { className: 'right-panel' },
        React.createElement('div', { className: 'stats-details' },
          React.createElement('div', { className: 'stat-detail-card' },
            React.createElement('p', { className: 'stat-detail-label' }, 'PROMEDIO DE GOLES'),
            React.createElement('p', { className: 'stat-detail-value' }, stats.avgGoles),
            React.createElement('p', { className: 'stat-detail-sub' }, 'Total goles: ' + Math.round(stats.avgGoles * stats.total))
          ),
          React.createElement('div', { className: 'stat-detail-card' },
            React.createElement('p', { className: 'stat-detail-label' }, 'PROMEDIO DE EDAD'),
            React.createElement('p', { className: 'stat-detail-value' }, stats.avgAge),
            React.createElement('p', { className: 'stat-detail-sub' }, 'Total asistencias: 238')
          ),
          React.createElement('div', { className: 'stat-detail-card stat-detail-dark' },
            React.createElement('p', { className: 'stat-detail-label' }, 'MÁXIMO GOLEADOR'),
            React.createElement('p', { className: 'stat-detail-value' }, stats.topScorer ? stats.topScorer.nombre : 'N/A')
          )
        ),
        React.createElement(SearchHistory, {
          history: searchHistory,
          onSelect: setSearchTerm,
          onClear: function() { setSearchHistory([]); }
        })
      )
    )
  );
}

export default ControlPanel;
