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

    // Guardar la consulta del usuario
    const imageQuery = new ImageQuery({
      userId,
      query: userQuery,
      improvedQuery
    });
    await imageQuery.save();

    return {
      images: images.map(image => ({
        url: image.imageUrl,
        description: image.description,
        niche: image.niche
      })),
    };
  } catch (error) {
    console.error("Error en processUserQuery:", error);
    throw error; // Es importante lanzar el error para manejarlo en el llamador.
  }
};

module.exports = { processUserQuery };