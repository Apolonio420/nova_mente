const OpenAIAPI = require("openai").default;
const mongoose = require('mongoose');
const Image = require('../models/Image');  
const ImageQuery = require('../models/ImageQuery'); 

const openai = new OpenAIAPI({ apiKey: "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" });

mongoose.connect('mongodb+srv://codeduostudios:YKCbGRPp3fIaPCuD@novamente.pibypbv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Conectado a MongoDB');
})
.catch(err => {
    console.error('Error al conectar a MongoDB:', err);
});

const processUserQuery = async (userQuery, userId) => {
  console.log("Dentro de processUserQuery");  // Nuevo log
  
  try {
    // Transform the user query using OpenAI API
    const prompt = `Describe a detailed image based on the following user query for a T-shirt design: "${userQuery}"`;
    const maxTokens = 20;
    
    console.log("Antes de llamar a OpenAI");  // Nuevo log
    
    const openAIResponse = await openai.completions.create({
      model: "text-davinci-002",
      prompt,
      max_tokens: maxTokens,
    });
    
    console.log("Después de llamar a OpenAI");  // Nuevo log

    const improvedQuery = openAIResponse.choices[0].text.trim();
    
    const concise_descriptions = [
      "Blue shark swimming left, coral background.",
      "Grey shark jumping over waves, 'SHARK' above.",
      "White and grey shark, open mouth, in blue circle."
    ];
  
    const styles = [
      "flat 2d, watercolour, clean, simple, white background, professional t-shirt design vector",
      "flat 2d, mottled style, clean, simple, white background, professional t-shirt design vector",
      "flat 2d, watercolour, clean, simple, white background, enclosed in a circle, professional t-shirt design vector"
    ];
  
    const creativePrompts = [];
    for (let i = 0; i < concise_descriptions.length; i++) {
      const description = concise_descriptions[i];
      const style = styles[i];
      const creative_prompt = `${description}, ${style}`;
      creativePrompts.push(creative_prompt);
    }
  
    const images = await Image.find(
      { $text: { $search: improvedQuery } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(5);
  
    const newImageQuery = new ImageQuery({
      query: userQuery,
      userId: userId
    });
  
    await newImageQuery.save();
  
    return {
      images: images.map(image => image.imageUrl),
      creativePrompts: creativePrompts
    };

  } catch (error) {
    console.log("Error en processUserQuery:", error);  // Nuevo log
  }
};


// Exporta la función para que pueda ser usada en otros archivos
module.exports = { processUserQuery };