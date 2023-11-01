const OpenAIAPI = require("openai").default;
const mongoose = require('mongoose');
const Image = require('../models/Image');  
const ImageQuery = require('../models/ImageQuery'); 

const openai = new OpenAIAPI({ apiKey: "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" });

mongoose.connect('mongodb+srv://codeduostudios:YKCbGRPp3fIaPCuD@novamente.pibypbv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a MongoDB');
}).catch(err => {
  console.error('Error al conectar a MongoDB:', err);
});

const processUserQuery = async (userQuery, userId) => {
  console.log("Dentro de processUserQuery");
  try {
    const prompt = `Describe a detailed image based on the following user query for a T-shirt design: "${userQuery}"`;
    const maxTokens = 20;
    console.log("Antes de llamar a OpenAI");
    const openAIResponse = await openai.completions.create({
      model: "text-davinci-002",
      prompt,
      max_tokens: maxTokens,
    });
    console.log("Después de llamar a OpenAI");
    const improvedQuery = openAIResponse.choices[0].text.trim();

    // Buscar imágenes basadas en la consulta mejorada
    const images = await Image.find({ $text: { $search: improvedQuery } });

    // Generar creativePrompts basados en la consulta mejorada (o en las imágenes encontradas)
    const creativePrompts = images.map(image => `${image.description}, ${image.style}`); // Asumiendo que cada imagen tiene una descripción y un estilo

    return {
      images: images.map(image => image.imageUrl),
      creativePrompts
    };
  } catch (error) {
    console.log("Error en processUserQuery:", error);
  }
};

module.exports = { processUserQuery };