const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config({ path: '../../.env' }); // Asegúrate de que esta ruta apunte a tu archivo .env

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  try {
    const myAssistant = await openai.beta.assistants.retrieve(
      "asst_TVEHG6nam5z0Dtzw2Z167ASt"
    );
    console.log("Asistente recuperado:", myAssistant);
  } catch (error) {
    console.error("Error al recuperar el asistente:", error);
  }
}

main();
