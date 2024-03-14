import React from 'react';
import { Link } from 'react-router-dom';
import "../styles/NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
      <p className="not-found-message">error</p>
        <div className="not-found-number">404</div>
        <p className="not-found-message">Página no encontrada</p>
        <Link to="/" className="not-found-link">
          Volver a la página de inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
