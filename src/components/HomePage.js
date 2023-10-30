import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TShirt2D from './TShirt2D';
import './HomePage.css';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    console.log("useEffect llamado, searchTerm:", searchTerm); // Log agregado
    if (searchTerm) {
      console.log("Enviando petición a /api/search"); // Log agregado
      axios.post('http://localhost:3001/api/search', { query: searchTerm }) // Asegúrate de que la URL sea correcta
        .then(response => {
          console.log("Respuesta del servidor:", response.data); // Log agregado
          if (response.data.success) {
            setImages(response.data.images);
          }
        })
        .catch(error => {
          console.error('Error al buscar imágenes:', error);
        });
    }
  }, [searchTerm]);

  return (
    <div className="homePage">
      <div className="topBar">
        {/* Aquí van los botones y otros elementos que quieras en la parte superior */}
      </div>
      <div className="tshirtContainer"> 
        <TShirt2D images={images} />
      </div>
      <div className="searchBar">
        <input 
          type="text" 
          placeholder="Buscar remera..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}

export default HomePage;
