import React, { useState } from 'react';
import axios from 'axios';
import './HomePage.css';

function HomePage() {
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [showText, setShowText] = useState(false); // Estado para mostrar/ocultar el campo de texto
  const [userText, setUserText] = useState(''); // Estado para almacenar el texto del usuario
  const [textOrientation, setTextOrientation] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const route = `http://localhost:3001/api/optimize-and-generate`;
  
    let combinedPrompt = description;
    if (style) {
      combinedPrompt += ` Estilo: ${style}`;
    }
    if (showText && userText) {
      combinedPrompt += ` Texto: "${userText}"`;
      if (textOrientation) {
        combinedPrompt += ` (Orientación: ${textOrientation})`;
      }
    }
  
    console.log("Enviando prompt:", combinedPrompt); // Mostrar el prompt que se está enviando
  
    try {
      const response = await axios.post(route, { prompt: combinedPrompt });
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
        {generatedImageUrl ? (
          <img src={generatedImageUrl} alt="Imagen Generada" className="generated-image" />
        ) : (
          <div className="placeholder-image">Imagen aquí</div>
        )}
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe la imagen que quieres"
          className="search-input"
        ></textarea>

        <select onChange={(e) => setStyle(e.target.value)}>
          <option value="">Selecciona un Estilo</option>
          <option value="Pop Art">Pop Art</option>
          <option value="Pixel Art">Pixel Art</option>
          <option value="Tribal">Tribal</option>
          <option value="Renacimiento">Renacimiento</option>
          <option value="Zen">Zen</option>
          <option value="3D">3D</option>
          <option value="Mecánico">Mecánico</option>
          <option value="Acuarela">Acuarela</option>
          <option value="Kawaii">Kawaii</option>
          <option value="Graffiti Urbano">Graffiti Urbano</option>
          <option value="Expresionismo Abstracto">Expresionismo Abstracto</option>
          <option value="Amigurumi">Amigurumi</option>
          {/* Agrega más estilos aquí */}
        </select>

        <div>
          <label>
            <input
              type="checkbox"
              checked={showText}
              onChange={() => setShowText(!showText)}
            />
            Añadir texto a la imagen
          </label>
        </div>

        {showText && (
          <div>
            <input
              type="text"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Escribe el texto para tu remera"
            />
            <select onChange={(e) => setTextOrientation(e.target.value)}>
              <option value="">Orientación del texto</option>
              <option value="arriba">Arriba</option>
              <option value="medio">Medio</option>
              <option value="abajo">Abajo</option>
              {/* Agrega más opciones aquí */}
            </select>
          </div>
        )}

        <button type="submit" className="generate-button">Generar Imagen</button>
      </form>
    </div>
  );
}

export default HomePage;
