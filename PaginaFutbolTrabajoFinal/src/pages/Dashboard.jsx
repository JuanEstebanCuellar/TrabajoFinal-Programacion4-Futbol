import React, { useState, useEffect } from 'react'; // Ahora sí usaremos useEffect
import PlayerTable from '../components/PlayerTable';
import SearchBar from '../components/SearchBar'; // Importamos el buscador
import playersData from '../data/players.json';
import '../styles/layout.css';

const Dashboard = () => {
  const safePlayers = Array.isArray(playersData) ? playersData : [];
  const [players, _setPlayers] = useState(safePlayers); // setter no usado, prefijado con _
  const [searchTerm, setSearchTerm] = useState(''); // <-- agregado
  const [filteredPlayers, setFilteredPlayers] = useState(safePlayers);

  // Filtrado con debounce y guardias
  useEffect(() => {
    const timer = setTimeout(() => {
      const results = (players || []).filter(player =>
        String(player?.name || '').toLowerCase().includes((searchTerm || '').toLowerCase())
      );
      setFilteredPlayers(results);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, players]);

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1 className="dashboard__title">Top Club Soccer ⚽</h1>
        <p className="dashboard__subtitle">Gestiona tus estrellas favoritas</p>
      </header>

      <main className="dashboard__content">
        {/* Usamos el componente SearchBar */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Mostramos contador de resultados */}
        <p style={{ margin: '10px 0', color: '#666' }}>
          Mostrando {filteredPlayers.length} resultados
        </p>

        {/* OJO: Aquí pasamos filteredPlayers, NO players */}
        <PlayerTable players={filteredPlayers} />
      </main>
    </div>
  );
};

export default Dashboard;