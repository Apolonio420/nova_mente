// HomePage.js

import React, { useState, useEffect } from 'react';
import TShirt3D from './TShirt3D';
import ImageCarousel from './ImageCarousel'; // Asegúrate de importar el componente
import './HomePage.css';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredImages, setFilteredImages] = useState([]); // Almacenar las imágenes filtradas

  useEffect(() => {
    // Aquí se haría la llamada a la API para obtener las imágenes
    // Por ahora, uso un conjunto de datos ficticio
    const imagesFromDB = [
      { id: 1, url: 'url1', description: 'shark' },
      { id: 2, url: 'url2', description: 'beach' },
      // ...
    ];

    // Filtrar imágenes basadas en searchTerm
    const filtered = imagesFromDB.filter(image => image.description.includes(searchTerm));
    setFilteredImages(filtered);
  }, [searchTerm]);

  return (
    <div className="homePage">
      <div className="topBar">
        {/* Aquí van los botones y otros elementos que quieras en la parte superior */}
      </div>
      <div className="tshirtContainer">
        <TShirt3D />
      </div>
      <div className="searchBar">
        <input 
          type="text" 
          placeholder="Buscar remera..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="carouselContainer">
        <ImageCarousel images={filteredImages} />
      </div>
    </div>
  );
}

export default HomePage;
