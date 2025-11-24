import React from 'react';

function StatsPanel({ stats, darkMode }) {
  return (
    <div className={'stats-panel ' + (darkMode ? 'stats-panel--dark' : '')}>
      <div className="stat-card">
        <p className="stat-label">Total Jugadores</p>
        <p className="stat-value">{stats.total}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Edad Promedio</p>
        <p className="stat-value">{stats.avgAge}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Goles Promedio</p>
        <p className="stat-value">{stats.avgGoles}</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Top Goleador</p>
        <p className="stat-value">{stats.topScorer ? stats.topScorer.nombre : 'N/A'}</p>
      </div>
    </div>
  );
}

export default StatsPanel;
