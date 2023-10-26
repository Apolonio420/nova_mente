const express = require('express');
const { OpenAIAPI } = require("openai");  // Importar SDK de OpenAI
const mongoose = require('mongoose');  // Importar Mongoose para interactuar con MongoDB
const Image = require('./Image');  // Importar el modelo de imagen
const SearchQuery = require('./SearchQuery');  // Importar el modelo de consulta de búsqueda

const openai = new OpenAIAPI({
    key: "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"  // Inicializar OpenAI con tu clave de API
});

const app = express();
app.use(express.json());  // Middleware para parsear JSON

// Nuevo endpoint para manejar las búsquedas
app.post('/search', async (req, res) => {
    const userQuery = req.body.query;  // Obtener la consulta del usuario desde el cuerpo de la solicitud

    // Paso 1: Enviar la consulta del usuario a la API de OpenAI
    let openAIResponse;
    try {
        openAIResponse = await openai.createCompletion({
            prompt: userQuery,  // La consulta del usuario
            max_tokens: 100  // Límite de tokens para la respuesta
        });
    } catch (error) {
        return res.status(500).json({ error: "Error al interactuar con OpenAI" });
    }

    const processedQuery = openAIResponse.choices[0].text.trim();  // Procesar la respuesta de OpenAI

    // Paso 2: Buscar en la base de datos las imágenes más relevantes usando la consulta procesada
    let images;
    try {
        images = await Image.find({
            description: new RegExp(processedQuery, 'i')  // Buscar por descripción usando expresiones regulares
        }).limit(5);  // Limitar a 5 resultados
    } catch (error) {
        return res.status(500).json({ error: "Error al buscar imágenes" });
    }

    // Paso 3: Almacenar la consulta de búsqueda en la base de datos
    const newSearchQuery = new SearchQuery({
        query: userQuery,
        // Aquí podrías añadir el userId si lo tienes disponible
    });
    await newSearchQuery.save();

    // Paso 4: Devolver las imágenes más relevantes al frontend
    res.json(images);
});

// Asumiendo que tu aplicación se ejecuta en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor ejecutándose en el puerto 3000');
});
