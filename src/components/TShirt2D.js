import React, { useEffect } from 'react';

const TShirt2D = ({ images }) => {
  useEffect(() => {
    const canvas = document.getElementById('tshirtCanvas');
    const ctx = canvas.getContext('2d');
    const tshirtImage = new Image();
    tshirtImage.onload = () => {
      ctx.drawImage(tshirtImage, 0, 0, 300, 400);
      const imageToDraw = (images && images.length > 0) ? images[0] : { url: '/dog1.png' };
      const overlayImage = new Image();
      overlayImage.onload = () => {
        const x = 100;
        const y = 150;
        ctx.drawImage(overlayImage, x, y, 100, 100);
      };
      overlayImage.src = imageToDraw.url;
    };
    tshirtImage.src = '/tshirt.png';
  }, [images]);

  return (
    <div style={{ position: 'relative', width: '300px', height: '400px' }}>
      <canvas id="tshirtCanvas" width="300" height="400"></canvas>
    </div>
  );
};

export default TShirt2D;
