import React from 'react';
import Dashboard from './pages/Dashboard'; // Importamos tu página principal
import './App.css'; // Mantenemos los estilos globales

function App() {
  return (
    <div className="App">
      {/* Aquí renderizamos todo el dashboard */}
      <Dashboard />
    </div>
  );
}

export default App;