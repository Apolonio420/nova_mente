import React, { useState } from 'react';
import TShirt3D from './TShirt3D';
import './HomePage.css';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

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
    </div>
  );
}

export default HomePage;
