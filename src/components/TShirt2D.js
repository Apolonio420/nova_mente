import React, { useEffect } from 'react';

const TShirt2D = ({ images }) => {
  useEffect(() => {
    console.log('useEffect called');
    console.log('Images array:', images);

    const canvas = document.getElementById('tshirtCanvas');
    const ctx = canvas.getContext('2d');

    const tshirtImage = new Image();
    tshirtImage.crossOrigin = 'Anonymous';
    tshirtImage.onload = () => {
      console.log('T-shirt image loaded');
      ctx.drawImage(tshirtImage, 0, 0, 300, 400);

      const imageToDraw = images && images.length > 0 ? images[0] : '/dog1.png';
      console.log('Image to draw:', imageToDraw);

      const overlayImage = new Image();
      overlayImage.crossOrigin = 'Anonymous';
      overlayImage.onload = () => {
        console.log('Overlay image loaded');
        const x = 100;
        const y = 150;
        ctx.drawImage(overlayImage, x, y, 100, 100);
      };
      overlayImage.onerror = (error) => {
        console.error('Error loading overlay image:', error);
      };
      overlayImage.src = decodeURIComponent(imageToDraw);
    };
    tshirtImage.onerror = (error) => {
      console.error('Error loading t-shirt image:', error);
    };
    tshirtImage.src = '/tshirt.png';
  }, [images]);

  return (
    <div style={{ position: 'relative', width: '300px', height: '400px' }}>
      <canvas id='tshirtCanvas' width='300' height='400'></canvas>
    </div>
  );
};

export default TShirt2D;