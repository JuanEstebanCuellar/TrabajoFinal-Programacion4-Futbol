import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import PlayerTable from './components/PlayerTable';
import Pagination from './components/Pagination';
import StatsPanel from './components/StatsPanel';
import Modal from './components/Modal';
import ThemeToggle from './components/ThemeToggle';
import SearchHistory from './components/SearchHistory';
import './App.css';

function App() {
  // Añadir estado para players y cargar dinámicamente el módulo
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    let mounted = true;
    // carga dinámica para evitar problemas con export default/named/otros
    import('./data/playersData')
      .then(function(mod) {
        try {
          var candidate = null;
          if (mod.playersData && Array.isArray(mod.playersData)) {
            candidate = mod.playersData;
          } else if (mod.default && Array.isArray(mod.default)) {
            candidate = mod.default;
          } else if (mod.players && Array.isArray(mod.players)) {
            candidate = mod.players;
          } else if (Array.isArray(mod)) {
            candidate = mod;
          } else if (mod.data && Array.isArray(mod.data)) {
            candidate = mod.data;
          }
          
          if (candidate && Array.isArray(candidate)) {
            if (mounted) setPlayers(candidate);
          } else {
            console.error('playersData import issue: could not resolve an array. module:', mod);
            if (mounted) setPlayers([]);
          }
        } catch (err) {
          console.error('Error processing playersData module:', err);
          if (mounted) setPlayers([]);
        }
      })
      .catch(function(err) {
        console.error('Error importing playersData:', err);
        if (mounted) setPlayers([]);
      });
    return function() { mounted = false; };
  }, []);

  // Estados principales
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });
  const [rowColors, setRowColors] = useState('none');
  const [darkMode, setDarkMode] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  // useEffect para cargar preferencias del localStorage al montar (usar try/catch)
  useEffect(() => {
    try {
      var savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    } catch (e) {
      console.error('Error parsing darkMode from localStorage', e);
    }

    try {
      var savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    } catch (e) {
      console.error('Error parsing favorites from localStorage', e);
    }

    try {
      var savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.error('Error parsing searchHistory from localStorage', e);
    }
  }, []);

  // Guardar cambios en preferencias
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // Actualizar clase en el body para estilos globales
    if (darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [darkMode]);

  useEffect(() => { localStorage.setItem('favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('searchHistory', JSON.stringify(searchHistory)); }, [searchHistory]);

  // Debounce para búsqueda (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Historial de búsqueda
  useEffect(() => {
    if (debouncedSearch && debouncedSearch.length > 2) {
      setSearchHistory(prev => {
        const newHistory = [debouncedSearch, ...prev.filter(s => s !== debouncedSearch)];
        return newHistory.slice(0, 5); // Guardar solo los últimos 5
      });
    }
  }, [debouncedSearch]);

  // Resetear página al filtrar
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch]);


  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO (useMemo) ---
  const filteredAndSortedPlayers = useMemo(() => {
    var result = Array.isArray(players) ? players.slice() : [];

    // Filtrar por favoritos
    if (favorites.length > 0) {
      result = result.filter(function(player) { return player && favorites.includes(player.id); });
    }

    // Filtrar por búsqueda (chequear que nombre sea string)
    if (debouncedSearch) {
      var searchLower = debouncedSearch.toLowerCase();
      result = result.filter(function(player) {
        return player && typeof player.nombre === 'string' && player.nombre.toLowerCase().includes(searchLower);
      });
    }

    // Ordenar (manejar valores undefined)
    if (sortConfig.key && sortConfig.direction !== 'none') {
      result.sort(function(a, b) {
        var aValue = a[sortConfig.key];
        var bValue = b[sortConfig.key];

        var aNum = typeof aValue === 'number' ? aValue : Number(aValue) || 0;
        var bNum = typeof bValue === 'number' ? bValue : Number(bValue) || 0;

        if (!isNaN(aNum) && !isNaN(bNum) && (typeof aValue === 'number' || typeof bValue === 'number')) {
          return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
        }

        var aString = aValue == null ? '' : String(aValue).toLowerCase();
        var bString = bValue == null ? '' : String(bValue).toLowerCase();

        if (sortConfig.direction === 'asc') {
          return aString.localeCompare(bString);
        } else {
          return bString.localeCompare(aString);
        }
      });
    }

    return result;
  }, [players, debouncedSearch, sortConfig, favorites]);


  // --- ESTADÍSTICAS ---
  const stats = useMemo(() => {
    const total = filteredAndSortedPlayers.length;
    if (total === 0) return { total: 0, avgAge: 0, avgGoles: 0, topScorer: null, positionDistribution: {} };

    const sumAge = filteredAndSortedPlayers.reduce((acc, p) => acc + (Number(p.edad) || 0), 0);
    const sumGoles = filteredAndSortedPlayers.reduce((acc, p) => acc + (Number(p.goles) || 0), 0);
    const topScorer = filteredAndSortedPlayers.reduce((max, p) => (Number(p.goles) || 0) > (Number(max.goles) || 0) ? p : max, filteredAndSortedPlayers[0]);

    const positionDistribution = {};
    filteredAndSortedPlayers.forEach(p => {
      const pos = p.posicion || 'Unknown';
      positionDistribution[pos] = (positionDistribution[pos] || 0) + 1;
    });

    return {
      total,
      avgAge: (sumAge / total).toFixed(1),
      avgGoles: (sumGoles / total).toFixed(2),
      topScorer: topScorer || null,
      positionDistribution
    };
  }, [filteredAndSortedPlayers]);


  // --- PAGINACIÓN ---
  const totalPages = Math.ceil(filteredAndSortedPlayers.length / itemsPerPage);
  const currentPlayers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPlayers.slice(start, start + itemsPerPage);
  }, [filteredAndSortedPlayers, currentPage, itemsPerPage]);


  // --- MANEJADORES DE EVENTOS ---
  const handleSort = function(key) {
    setSortConfig(function(prev) {
      return {
        key: key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      };
    });
  };

  return (
    <div className={'app ' + (darkMode ? 'app--dark' : '')}>
      <header className="app__header">
        <div className="app__header-content">
          <div className="app__header-left">
            <h1 className="app__title">TOP CLUB SOCCER</h1>
            <p className="app__subtitle">
              Dashboard de Jugadores
            </p>
            <p className="app__description">
              Gestiona tus estrellas favoritas, analiza estadísticas y descubre talentos.
            </p>
          </div>
          <div className="app__header-right">
            <ThemeToggle darkMode={darkMode} onToggle={setDarkMode} />
            <button className="app__oscuro-btn">Modo Oscuro</button>
          </div>
        </div>
      </header>

      {/* Banner visible si no se cargaron datos de jugadores */}
      { (!Array.isArray(players) || players.length === 0) ? (
        React.createElement('div', { className: 'app__error', style: { padding: 12, background: '#ffe6e6', color: '#660000', textAlign: 'center' } },
          'No se pudieron cargar los datos de jugadores. Revisa src/data/playersData (export default / named export).'
        )
      ) : null }

      <main className="app__main">
        
        {/* Sección de Búsqueda */}
        <div className="search-section">
          <h3 className="search-section-title">BUSCAR JUGADORES</h3>
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
        </div>

        {/* Panel Principal: Stats + Historial + Filtros */}
        <div className="main-panel">
          <div className="left-panel">
            <div className="stats-compact">
              <div className="stat-compact-item">
                <p className="stat-compact-label">JUGADORES EN TABLA</p>
                <p className="stat-compact-value">{stats.total}</p>
                <p className="stat-compact-sub">Favoritos: {favorites.length}</p>
              </div>
            </div>
            <div className="filter-buttons">
              <button className={'btn-filter ' + (rowColors === 'pares' ? 'active' : '')} onClick={() => setRowColors(rowColors === 'pares' ? 'none' : 'pares')}>
                Pintar filas pares
              </button>
              <button className={'btn-filter ' + (rowColors === 'impares' ? 'active' : '')} onClick={() => setRowColors(rowColors === 'impares' ? 'none' : 'impares')}>
                Pintar filas impares
              </button>
              <button className="btn-filter" onClick={() => setRowColors('none')}>
                Limpiar color
              </button>
            </div>
          </div>

          <div className="right-panel">
            <div className="stats-details">
              <div className="stat-detail-card">
                <p className="stat-detail-label">PROMEDIO DE GOLES</p>
                <p className="stat-detail-value">{stats.avgGoles}</p>
                <p className="stat-detail-sub">Total goles: {Math.round(stats.avgGoles * stats.total)}</p>
              </div>
              <div className="stat-detail-card">
                <p className="stat-detail-label">PROMEDIO DE EDAD</p>
                <p className="stat-detail-value">{stats.avgAge}</p>
                <p className="stat-detail-sub">Total asistencias: 238</p>
              </div>
              <div className="stat-detail-card stat-detail-dark">
                <p className="stat-detail-label">MÁXIMO GOLEADOR</p>
                <p className="stat-detail-value">{stats.topScorer ? stats.topScorer.nombre : 'N/A'}</p>
              </div>
            </div>
            <SearchHistory 
              history={searchHistory} 
              onSelect={setSearchTerm} 
              onClear={() => setSearchHistory([])} 
            />
          </div>
        </div>

        {/* Tabla Principal */}
        <PlayerTable 
          players={currentPlayers}
          onSort={handleSort}
          rowColors={rowColors}
          favorites={favorites}
          onToggleFavorite={(id) => setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])}
          onRowClick={(player) => { setSelectedPlayer(player); setIsModalOpen(true); }}
        />

        {/* Paginación */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />

      </main>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        player={selectedPlayer}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App;