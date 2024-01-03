// Importar módulos necesarios
const NLPCloudClient = require('nlpcloud');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Definir el nombre del modelo y cargar el token de API
const modelo = 'paraphrase-multilingual-mpnet-base-v2';
const token = process.env.NLPCLOUD_API_KEY;

// Verificar que el token está presente
if (!token) {
    console.error('Error: Token de NLP Cloud no definido. Verifica tu archivo .env');
    process.exit(1);
}

// Inicializar cliente NLP Cloud
const client = new NLPCloudClient(modelo, token);

// Función para obtener embeddings
async function obtenerEmbeddings(texto) {
    try {
        const response = await client.embeddings(texto);
        return response.embeddings;
    } catch (error) {
        console.error('Error al obtener embeddings:', error);
        throw error;
    }
}

// Función principal para procesar el archivo JSON
async function procesarImagenes() {
    const archivoImagenes = path.join(__dirname, 'imagenes.json');
    let imagenes = JSON.parse(fs.readFileSync(archivoImagenes, 'utf8'));

    for (let imagen of imagenes) {
        console.log(`Procesando imagen: ${imagen.imageUrl}`);
        imagen.embedding = await obtenerEmbeddings(imagen.description);
    }

    const archivoSalida = path.join(__dirname, 'imagenes_con_embeddings.json');
    fs.writeFileSync(archivoSalida, JSON.stringify(imagenes, null, 2));
    console.log('Archivo JSON con embeddings creado.');
}

// Ejecutar la función principal
procesarImagenes().catch(console.error);
