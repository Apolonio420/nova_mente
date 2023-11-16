require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const Image = require('../models/Image');
const ImageQuery = require('../models/ImageQuery');
const axios = require('axios');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch(err => {
  console.error('Error al conectar a MongoDB:', err);
});

const checkResponseStatus = (response) => {
  console.log(`Estado de la respuesta: ${response.status}`);
  if (response.status !== 200) {
    console.error(`Error en la API de OpenAI: Estado ${response.status}`);
    throw new Error(`Error en la API de OpenAI: Estado ${response.status}`);
  }
};

const getAvailableNiches = async () => {
  try {
    const nicheAggregation = await Image.aggregate([
      {
        $group: {
          _id: "$niche",
          count: { $sum: 1 }
        }
      }
    ]);
    return nicheAggregation.map(item => item._id);
  } catch (error) {
    console.error('Error al obtener los nichos disponibles:', error);
    throw error;
  }
};

const determineNiche = async (description, availableNiches) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: "system", content: "This is a classification assistant. Given a description, it will determine the most suitable category." },
        { role: "user", content: `Description: "${description}". Categories: ${availableNiches.join(', ')}.` }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    checkResponseStatus(response);
    const nicheSuggestion = response.data.choices[0].message.content.trim();
    return availableNiches.includes(nicheSuggestion) ? nicheSuggestion : null;
  } catch (error) {
    console.error('Error al determinar el nicho:', error);
    throw error;
  }
};

const findKeywords = async (description) => {
  try {
    console.log(`Generando palabras clave para: "${description}"`);
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: "system", content: "I am a keyword generation assistant that provides relevant keywords for image searches." },
        { role: "user", content: `Please provide keywords that best describe an image showing a ${description}.` }
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    checkResponseStatus(response);
    const keywordsString = response.data.choices[0].message.content.trim();
    return keywordsString.split(',').map(keyword => keyword.trim());
  } catch (error) {
    console.error("Error en findKeywords:", error);
    throw error;
  }
};

const processUserQuery = async (userQuery, userId) => {
  try {
    const availableNiches = await getAvailableNiches();
    const niche = await determineNiche(userQuery, availableNiches);
    const searchKeywords = niche ? await findKeywords(userQuery) : userQuery.split(' ');
    
    console.log(`Palabras clave de búsqueda: ${searchKeywords.join(' ')}`);

    let images = await Image.find({
      $text: { $search: searchKeywords.join(' ') },
      ...(niche ? { niche: niche } : {})
    }, {
      score: { $meta: "textScore" }
    }).sort({
      score: { $meta: "textScore" }
    }).limit(10);

    if (images.length === 0) {
      console.log('No se encontraron imágenes, buscando imágenes predeterminadas.');
      images = await Image.find().limit(10);
    }

    await new ImageQuery({
      userId,
      query: userQuery,
      improvedQuery: searchKeywords.join(' ')
    }).save();

    return { success: true, images: images.map(image => ({
      url: image.imageUrl,
      description: image.description,
      niche: image.niche
    })) };
  } catch (error) {
    console.error("Error en processUserQuery:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { processUserQuery };
