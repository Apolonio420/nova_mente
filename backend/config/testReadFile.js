const fs = require('fs');
const path = require('path');

// Reemplaza esto con la ruta completa a uno de los archivos que sabes que existe pero que no se está listando
const filePath = '/home/apolonio420/nova_mente/src/images/batch 1/Comida/Coffee cup, with steam, flat 2d, modern minimalistic style, clean, simple, white background, invoking a sense of comfort and relaxation, professional t - shirt design vector';

try {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  console.log(`Lectura exitosa: ${filePath}`);
  console.log(fileContent.substring(0, 100)); // Muestra los primeros 100 caracteres del contenido del archivo
} catch (error) {
  console.error(`Error al leer el archivo: ${filePath}`, error);
}
