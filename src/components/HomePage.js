import React, { useState } from 'react';
import axios from 'axios';
import './HomePage.css';

function HomePage() {
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [showText, setShowText] = useState(false);
  const [userText, setUserText] = useState('');
  const [textOrientation, setTextOrientation] = useState('');
  const [processedImage, setProcessedImage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const route = `http://localhost:3001/api/optimize-and-generate`;

    let combinedPrompt = description;
    if (style) combinedPrompt += ` Estilo: ${style}`;
    if (showText && userText) {
      combinedPrompt += ` Texto: "${userText}"`;
      if (textOrientation) combinedPrompt += ` (Orientación: ${textOrientation})`;
    }

    try {
      const response = await axios.post(route, { prompt: combinedPrompt });
      setGeneratedImageUrl(response.data.imageUrl);
      setProcessedImage(''); // Limpiar la imagen procesada anterior
    } catch (error) {
      console.error('Error al generar imagen:', error);
    }
  };


  const handleProcessImage = async () => {
    const route = `http://localhost:3001/api/remove-background`;
  
    try {
      const response = await axios.post(route, { imageUrl: generatedImageUrl });
      setGeneratedImageUrl(response.data.image); // Asegúrate de que esta línea sea correcta
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
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
        {generatedImageUrl && (
          <>
            <img src={generatedImageUrl} alt="Imagen Generada" className="generated-image" />
            <button onClick={handleProcessImage} className="process-button">Procesar Imagen</button>
          </>
        )}
        {processedImage && (
          <div>
            <h3>Imagen Procesada:</h3>
            <img src={`data:image/png;base64,${processedImage}`} alt="Imagen Procesada" className="processed-image" />
          </div>
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
          {/* Opciones de estilos aquí */}
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
              {/* Opciones de orientación aquí */}
            </select>
          </div>
        )}

        <button type="submit" className="generate-button">Generar Imagen</button>
      </form>
    </div>
  );
}

export default HomePage;
