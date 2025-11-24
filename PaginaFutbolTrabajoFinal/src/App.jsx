import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import PlayerTable from './components/PlayerTable';
import Pagination from './components/Pagination';
import Modal from './components/Modal';
import ThemeToggle from './components/ThemeToggle';
import SearchHistory from './components/SearchHistory';
import ControlPanel from './components/ControlPanel';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);
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

  // Cargar players dinámicamente
  useEffect(function() {
    var mounted = true;
    import('./data/playersData')
      .then(function(mod) {
        try {
          var candidate = mod.playersData || mod.default || mod.players || (Array.isArray(mod) ? mod : mod.data);
          if (Array.isArray(candidate) && mounted) {
            setPlayers(candidate);
          } else if (mounted) {
            console.error('playersData import issue:', mod);
            setPlayers([]);
          }
        } catch (err) {
          console.error('Error processing playersData:', err);
          if (mounted) setPlayers([]);
        }
      })
      .catch(function(err) {
        console.error('Error importing playersData:', err);
        if (mounted) setPlayers([]);
      });
    return function() { mounted = false; };
  }, []);

  // Cargar preferencias del localStorage
  useEffect(function() {
    try {
      var savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    } catch (e) {
      console.error('Error parsing darkMode:', e);
    }
    try {
      var savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    } catch (e) {
      console.error('Error parsing favorites:', e);
    }
    try {
      var savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.error('Error parsing searchHistory:', e);
    }
  }, []);

  // Guardar darkMode
  useEffect(function() {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [darkMode]);

  // Guardar favorites
  useEffect(function() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Guardar historial
  useEffect(function() {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Debounce búsqueda (300ms)
  useEffect(function() {
    var timer = setTimeout(function() {
      setDebouncedSearch(searchTerm);
    }, 300);
    return function() { clearTimeout(timer); };
  }, [searchTerm]);

  // Actualizar historial
  useEffect(function() {
    if (debouncedSearch && debouncedSearch.length > 2) {
      setSearchHistory(function(prev) {
        var newHistory = [debouncedSearch, ...prev.filter(function(s) { return s !== debouncedSearch; })];
        return newHistory.slice(0, 5);
      });
    }
  }, [debouncedSearch]);

  // Resetear página al filtrar
  useEffect(function() {
    setCurrentPage(1);
  }, [debouncedSearch]);

  // Filtrado y ordenamiento
  var filteredAndSortedPlayers = useMemo(function() {
    var result = [...players];

    if (debouncedSearch) {
      var searchLower = debouncedSearch.toLowerCase();
      result = result.filter(function(player) {
        return player && typeof player.nombre === 'string' && player.nombre.toLowerCase().includes(searchLower);
      });
    }

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
        return sortConfig.direction === 'asc' ? aString.localeCompare(bString) : bString.localeCompare(aString);
      });
    }

    return result;
  }, [players, debouncedSearch, sortConfig]);

  // Estadísticas
  var stats = useMemo(function() {
    var total = filteredAndSortedPlayers.length;
    if (total === 0) return { total: 0, avgAge: 0, avgGoles: 0, topScorer: null };

    var sumAge = filteredAndSortedPlayers.reduce(function(acc, p) { return acc + (Number(p.edad) || 0); }, 0);
    var sumGoles = filteredAndSortedPlayers.reduce(function(acc, p) { return acc + (Number(p.goles) || 0); }, 0);
    var topScorer = filteredAndSortedPlayers.reduce(function(max, p) {
      return (Number(p.goles) || 0) > (Number(max.goles) || 0) ? p : max;
    }, filteredAndSortedPlayers[0]);

    return {
      total: total,
      avgAge: (sumAge / total).toFixed(1),
      avgGoles: (sumGoles / total).toFixed(2),
      topScorer: topScorer || null
    };
  }, [filteredAndSortedPlayers]);

  // Paginación
  var totalPages = Math.ceil(filteredAndSortedPlayers.length / itemsPerPage);
  var currentPlayers = useMemo(function() {
    var start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedPlayers.slice(start, start + itemsPerPage);
  }, [filteredAndSortedPlayers, currentPage, itemsPerPage]);

  // Callbacks
  var handleSort = useCallback(function(key) {
    setSortConfig(function(prev) {
      return {
        key: key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      };
    });
  }, []);

  var handleToggleFavorite = useCallback(function(id) {
    setFavorites(function(prev) {
      return prev.includes(id) ? prev.filter(function(f) { return f !== id; }) : [...prev, id];
    });
  }, []);

  var handleRowClick = useCallback(function(player) {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  }, []);

  return (
    React.createElement('div', { className: 'app ' + (darkMode ? 'app--dark' : '') },
      React.createElement('header', { className: 'app__header' },
        React.createElement('div', { className: 'app__header-content' },
          React.createElement('div', { className: 'app__header-left' },
            React.createElement('h1', { className: 'app__title' }, 'TOP CLUB SOCCER'),
            React.createElement('p', { className: 'app__subtitle' }, 'Dashboard de Jugadores'),
            React.createElement('p', { className: 'app__description' }, 'Gestiona tus estrellas favoritas, analiza estadísticas y descubre talentos.')
          ),
          React.createElement('div', { className: 'app__header-right' },
            React.createElement(ThemeToggle, { darkMode: darkMode, onToggle: setDarkMode }),
            React.createElement('button', { className: 'app__oscuro-btn' }, 'Modo Oscuro')
          )
        )
      ),

      !Array.isArray(players) || players.length === 0 ? React.createElement('div', { className: 'app__error', style: { padding: 12, background: '#ffe6e6', color: '#660000', textAlign: 'center' } }, 'No se pudieron cargar los datos de jugadores.') : null,

      React.createElement('main', { className: 'app__main' },
        React.createElement('div', { className: 'search-section' },
          React.createElement('h3', { className: 'search-section-title' }, 'BUSCAR JUGADORES'),
          React.createElement(SearchBar, { searchTerm: searchTerm, setSearchTerm: setSearchTerm })
        ),

        React.createElement(ControlPanel, { 
          stats: stats, 
          favorites: favorites, 
          rowColors: rowColors, 
          setRowColors: setRowColors,
          searchHistory: searchHistory,
          setSearchHistory: setSearchHistory,
          setSearchTerm: setSearchTerm
        }),

        React.createElement(PlayerTable, {
          players: currentPlayers,
          onSort: handleSort,
          rowColors: rowColors,
          favorites: favorites,
          onToggleFavorite: handleToggleFavorite,
          onRowClick: handleRowClick
        }),

        React.createElement(Pagination, {
          currentPage: currentPage,
          totalPages: totalPages,
          onPageChange: setCurrentPage,
          itemsPerPage: itemsPerPage,
          onItemsPerPageChange: setItemsPerPage
        })
      ),

      React.createElement(Modal, {
        isOpen: isModalOpen,
        onClose: function() { setIsModalOpen(false); },
        player: selectedPlayer,
        darkMode: darkMode
      })
    )
  );
}

export default App;