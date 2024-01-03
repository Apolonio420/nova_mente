import React, { useState } from 'react';
import axios from 'axios';
import './HomePage.css';

function HomePage() {
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const route = `http://localhost:3001/api/search/generate-image-helped`;

    try {
      const response = await axios.post(route, { description, style });
      setGeneratedImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error('Error al generar imagen:', error);
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <img src="/path/to/your/logo.png" alt="Logo" className="logo" />
        <h1>Novamente</h1>
        <button className="auth-button">Login/Signup</button>
      </header>

      <div className="image-container">
        {generatedImageUrl ? <img src={generatedImageUrl} alt="Imagen Generada" className="generated-image" /> : <div className="placeholder-image">Imagen aquí</div>}
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <textarea onChange={(e) => setDescription(e.target.value)} placeholder="Describe la imagen que quieres" className="search-input"></textarea>
        <select onChange={(e) => setStyle(e.target.value)}>
          <option value="">Selecciona un Estilo</option>
          {/* Opciones de estilo aquí */}
        </select>
        <button type="submit" className="generate-button">Generar Imagen</button>
      </form>
    </div>
  );
}

export default HomePage;
