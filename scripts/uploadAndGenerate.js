const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Inicializa el cliente S3 con las credenciales y la región correcta
const s3Client = new S3Client({
    credentials: {
        accessKeyId: 'AKIAVWKDZK4OYSTDSE4C',
        secretAccessKey: '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'
    },
    region: 'sa-east-1'
});

const imagesFolder = path.join(__dirname, '..', 'src', 'images', 'batch 1');

function getFilesRecursively(directory) {
  let files = [];
  const items = fs.readdirSync(directory, { withFileTypes: true });
  for (const item of items) {
    const resPath = path.resolve(directory, item.name);
    if (item.isDirectory()) {
      files = [...files, ...getFilesRecursively(resPath)];
    } else {
      files.push(resPath);
    }
  }
  return files;
}

async function uploadFile(filePath) {
    const fileStream = fs.createReadStream(filePath);
    const bucketName = "novamente42";
    const relativePath = path.relative(imagesFolder, filePath);
    const objectKey = `images/${relativePath.replace(/\\/g, "/")}`; // reemplazar \ por / en Windows

    const contentType = path.extname(filePath) === '.png' ? 'image/png' : 'image/jpeg';

    const uploadParams = {
      Bucket: bucketName,
      Key: objectKey,
      Body: fileStream,
      ACL: 'public-read',
      ContentType: contentType  // Agregar el tipo de contenido aquí
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);
      console.log(`Archivo subido con éxito: ${objectKey}`);
      return `https://${bucketName}.s3.sa-east-1.amazonaws.com/${objectKey}`;
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      throw new Error('Error al subir el archivo a S3');
    }
}



async function uploadImagesAndGenerateJson() {
    const files = getFilesRecursively(imagesFolder);
    const uploadedImages = [];

    for (const file of files) {
        const fileUrl = await uploadFile(file);
        uploadedImages.push({ imageUrl: fileUrl, filePath: file });
    }

    // Aquí se define la ruta a la carpeta config dentro de backend
    const jsonDirectory = path.join(__dirname, '..', 'backend', 'config');
    const jsonFilePath = path.join(jsonDirectory, 'imagenes.json');
    const jsonContent = JSON.stringify(uploadedImages, null, 2);

    // Crear el directorio si no existe
    if (!fs.existsSync(jsonDirectory)) {
        fs.mkdirSync(jsonDirectory, { recursive: true });
    }

    // Escribir el archivo JSON
    fs.writeFileSync(jsonFilePath, jsonContent);
    console.log(`Archivo JSON generado con éxito en: ${jsonFilePath}`);
}

// Llama a la función principal para iniciar el proceso
uploadImagesAndGenerateJson().catch(console.error);
