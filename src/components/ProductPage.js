import React from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>Detalles del Producto</h1>
      <p>Estás viendo el producto con ID: {id}</p>
    </div>
  );
}

export default ProductPage;
