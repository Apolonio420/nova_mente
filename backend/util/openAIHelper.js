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
    // Transform the user query using OpenAI API
    const prompt = `Describe a detailed image based on the following user query for a T-shirt design: "${userQuery}"`;
    const maxTokens = 20;
  
    const openAIResponse = await openai.completions.create({
      model: "text-davinci-002",
      prompt,
      max_tokens: maxTokens,
    });
  
    const improvedQuery = openAIResponse.choices[0].text.trim();
  
    // Example concise descriptions for the creative prompts
    const concise_descriptions = [
      "Blue shark swimming left, coral background.",
      "Grey shark jumping over waves, 'SHARK' above.",
      "White and grey shark, open mouth, in blue circle."
    ];
  
    // Styles for the creative prompts
    const styles = [
      "flat 2d, watercolour, clean, simple, white background, professional t-shirt design vector",
      "flat 2d, mottled style, clean, simple, white background, professional t-shirt design vector",
      "flat 2d, watercolour, clean, simple, white background, enclosed in a circle, professional t-shirt design vector"
    ];
  
    // Generate creative prompts by combining concise descriptions with styles
    const creativePrompts = [];
    for (let i = 0; i < concise_descriptions.length; i++) {
      const description = concise_descriptions[i];
      const style = styles[i];
      const creative_prompt = `${description}, ${style}`;
      creativePrompts.push(creative_prompt);
    }
  
    // Search for the 5 best matching images
    const images = await Image.find(
      { $text: { $search: improvedQuery } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .limit(5);
  
    // Register the user query
    const newImageQuery = new ImageQuery({
      query: userQuery,
      userId: userId
    });
  
    await newImageQuery.save();
  
    return {
      images: images.map(image => image.imageUrl), 
      creativePrompts: creativePrompts
    };
  };
  
  // Example usage
  (async () => {
    const userQuery = "I want a shark design";
    const userId = "653b0d622a4bd28df2a24693"; // Aquí iría el ID del usuario que realiza la consulta
    const result = await processUserQuery(userQuery, userId);
    
    console.log("Image URLs:", result.images);
    console.log("Creative Prompts:", result.creativePrompts);
  })();
  