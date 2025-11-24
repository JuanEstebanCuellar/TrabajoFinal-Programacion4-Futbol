import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) {
  var numTotalPages = Number(totalPages);
  var numCurrentPage = Number(currentPage);
  var numItemsPerPage = Number(itemsPerPage);
  
  // si no son números válidos, usar defaults
  if (isNaN(numTotalPages) || numTotalPages < 1) numTotalPages = 1;
  if (isNaN(numCurrentPage) || numCurrentPage < 1) numCurrentPage = 1;
  if (isNaN(numItemsPerPage) || numItemsPerPage < 1) numItemsPerPage = 10;

  return (
    <div className="pagination">
      <div className="pagination-controls">
        <button onClick={function() { onPageChange(numCurrentPage > 1 ? numCurrentPage - 1 : 1); }} disabled={numCurrentPage === 1}>
          ← Anterior
        </button>
        <span className="pagination-info">Página {numCurrentPage} de {numTotalPages}</span>
        <button onClick={function() { onPageChange(numCurrentPage < numTotalPages ? numCurrentPage + 1 : numTotalPages); }} disabled={numCurrentPage === numTotalPages}>
          Siguiente →
        </button>
      </div>
      <div className="pagination-settings">
        <label>Elementos por página:</label>
        <select value={numItemsPerPage} onChange={function(e) { onItemsPerPageChange(Number(e.target.value)); }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}

export default Pagination;
