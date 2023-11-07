const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configura las credenciales y la región de AWS
AWS.config.update({
    accessKeyId: 'AKIAVWKDZK4OYSTDSE4C',
    secretAccessKey: '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',
    region: 'sa-east-1'
});

const s3 = new AWS.S3();
const imagesFolderPath = path.join(__dirname, '..', 'src', 'images', 'batch 1');

const getFilesRecursively = (directory) => {
  let filesInDirectory = fs.readdirSync(directory);
  let files = [];
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
      files = [...files, ...getFilesRecursively(absolute)];
    } else {
      files.push(absolute);
    }
  }
  return files;
};

const uploadFileToS3 = async (filePath) => {
  const fileContent = fs.readFileSync(filePath);
  const baseName = path.basename(filePath);
  const uniqueName = `${uuidv4()}-${baseName}`;
  const fileExtension = path.extname(filePath).toLowerCase();
  
  let contentType = 'image/jpeg';
  if (fileExtension === '.png') {
    contentType = 'image/png';
  } else if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
    contentType = 'image/jpeg';
  } // Agrega más condiciones si necesitas soportar otros tipos de imagen
  
  const parts = filePath.split(path.sep);
  const batchIndex = parts.indexOf('batch 1');
  const niche = parts[batchIndex + 1];

  const params = {
    Bucket: 'novamente42',
    Key: `imagenes/${niche}/${uniqueName}`, // Incluye el nicho en el Key
    Body: fileContent,
    ContentType: contentType,
    ACL: 'public-read',
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(`Archivo subido con éxito: ${data.Location}`);
    return {
      imageUrl: data.Location,
      niche: niche
    };
  } catch (err) {
    throw new Error(`Error al subir archivo: ${err.message}`);
  }
};

const uploadImagesAndGenerateJson = async () => {
  const files = getFilesRecursively(imagesFolderPath);
  let imagesData = [];

  for (const file of files) {
    const { imageUrl, niche } = await uploadFileToS3(file);
    imagesData.push({
      imageUrl,
      description: path.basename(file, path.extname(file)),
      niche: niche // Agrega el campo niche
    });
  }

  fs.writeFileSync(path.join(__dirname, '..', 'backend', 'config', 'imagenes.json'), JSON.stringify(imagesData, null, 2));
  console.log('Archivo JSON generado con éxito.');
};

uploadImagesAndGenerateJson().catch(console.error);