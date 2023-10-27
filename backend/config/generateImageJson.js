const fs = require('fs');
const path = require('path');

// Define la carpeta que contiene tus imágenes
const imagesFolder = path.join(__dirname, 'images', 'batch 1');

// Define el archivo JSON de salida
const outputJsonFile = path.join(__dirname, 'imagenes1.json');

// Lee la carpeta de imágenes
fs.readdir(imagesFolder, (err, files) => {
  if (err) {
    console.error('Error al leer la carpeta de imágenes:', err);
    return;
  }

  // Filtra los archivos para obtener solo imágenes (p.ej., archivos .jpg y .png)
  const imageFiles = files.filter(file => ['.jpg', '.png'].includes(path.extname(file)));

  // Crea un array de objetos para cada imagen
  const imagesData = imageFiles.map(file => {
    return {
      description: path.basename(file, path.extname(file)) // Usa el nombre del archivo como descripción
    };
  });

  // Escribe el array de objetos en un archivo JSON
  fs.writeFile(outputJsonFile, JSON.stringify(imagesData, null, 2), 'utf8', err => {
    if (err) {
      console.error('Error al escribir el archivo JSON:', err);
      return;
    }

    console.log('Archivo JSON creado exitosamente.');
  });
});
