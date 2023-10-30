import React, { useEffect } from 'react';

const TShirt2D = ({ images }) => {
  useEffect(() => {
    const canvas = document.getElementById('tshirtCanvas');
    const ctx = canvas.getContext('2d');
    const tshirtImage = new Image();

    tshirtImage.onload = () => {
      ctx.drawImage(tshirtImage, 0, 0, 300, 400);  // Asume que el tamaño del canvas es 300x400
      
      const imageToDraw = images.length > 0 ? images[0] : { url: '/dog1.png' };

      const overlayImage = new Image();
      overlayImage.onload = () => {
        const x = 100;  // Posición x
        const y = 150;  // Posición y
        ctx.drawImage(overlayImage, x, y, 100, 100);  // 100x100 es el tamaño de la imagen superpuesta
      };
      overlayImage.src = imageToDraw.url;
    };

    tshirtImage.src = '/tshirt.png';  // Reemplaza con la ruta a tu imagen de camiseta

  }, [images]);

  return (
    <div style={{ position: 'relative', width: '300px', height: '400px' }}>
      <canvas id="tshirtCanvas" width="300" height="400"></canvas>
    </div>
  );
};

export default TShirt2D;
