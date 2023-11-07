const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

const imagesRootFolder = path.join(__dirname, '..', '..', 'src', 'images', 'batch 1');
const outputJsonFile = path.join(imagesRootFolder, '..', 'imagenes.json');

function findImages(pattern) {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

(async function generateImagesJson() {
  try {
    console.log("Iniciando el script...");
    console.log(`La carpeta de imágenes es: ${imagesRootFolder}`);
    console.log(`El archivo JSON de salida es: ${outputJsonFile}`);

    const files = await findImages(`${imagesRootFolder}/**/*.png`);
    const imagesList = files.map(file => ({
      imageUrl: path.relative(imagesRootFolder, file),
      description: path.basename(file, '.png'),
      niche: path.basename(path.dirname(file))
    }));

    console.log(`Total de imágenes procesadas: ${imagesList.length}`);

    await fs.writeFile(outputJsonFile, JSON.stringify(imagesList, null, 2), 'utf8');
    console.log(`Archivo JSON generado en: ${outputJsonFile}`);
  } catch (error) {
    console.error('Error durante la generación del JSON:', error);
  }
})();
