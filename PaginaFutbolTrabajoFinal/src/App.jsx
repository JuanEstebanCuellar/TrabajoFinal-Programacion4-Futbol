import React from 'react';
import Dashboard from './pages/Dashboard'; // Importamos tu página principal
import "./styles/App.css";

function App() {
  return (
    <div className="App">
      {/* Aquí renderizamos todo el dashboard */}
      <Dashboard />
    </div>
  );
}

export default App;