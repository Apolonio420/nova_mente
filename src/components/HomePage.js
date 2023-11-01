import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TShirt3D from './TShirt3D';
import './HomePage.css';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    console.log('useEffect llamado, searchTerm:', searchTerm);
    if (searchTerm) {
      console.log('Enviando petición a /api/search');
      axios.post('http://localhost:3001/api/search', { query: searchTerm })
        .then(response => {
          console.log('Respuesta del servidor:', response.data);
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
    <div className='homePage'>
      <div className='topBar'>
        {/* Aquí puedes añadir elementos a la barra superior, como un logo o menús */}
      </div>
      <div className='tshirtContainer'>
        <TShirt3D images={images} />
      </div>
      <div className='searchBar'>
        <input
          type='text'
          placeholder='Buscar remera...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default HomePage;