const OpenAI = require('openai');
require('dotenv').config({ path: '../../.env' });
const fetch = require('node-fetch');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function runAssistant(assistantId, userPrompt) {
    try {
        console.log("Creando Thread con prompt:", userPrompt);
        const threadResponse = await openai.beta.threads.create({
            messages: [{ role: "user", content: userPrompt }],
        });
        console.log("Thread creado, ID:", threadResponse.id);

        const runResponse = await openai.beta.threads.runs.create(threadResponse.id, { assistant_id: assistantId });
        console.log("Run iniciado, ID:", runResponse.id);

        let runStatus = await openai.beta.threads.runs.retrieve(threadResponse.id, runResponse.id);
        while (runStatus.status !== 'completed') {
            console.log("Esperando a que Run termine, estado actual:", runStatus.status);
            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(threadResponse.id, runResponse.id);
        }
        console.log("Run completado, recuperando mensajes...");

        const messages = await openai.beta.threads.messages.list(threadResponse.id);
        console.log("Mensajes recuperados:");

        messages.data.forEach(message => {
            if (message.role === "assistant") {
                console.log("Mensaje del asistente:", message.content[0].text.value);
            }
        });

        return messages.data.filter(message => message.role === "assistant").map(message => message.content[0].text.value);
    } catch (error) {
        console.error("Error al ejecutar el asistente con el prompt:", error);
        throw error;
    }
}

async function generateImageWithDalle(prompt) {
  const apiKey = process.env.OPENAI_API_KEY; // Asegúrate de que la clave API esté en tu archivo .env
  const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": 'application/json'
  };

  const body = JSON.stringify({
      prompt: prompt,
      n: 1, // Número de imágenes a generar
      size: "1024x1024"
  });

  try {
      const response = await fetch("https://api.openai.com/v1/images/generations", { method: "POST", headers: headers, body: body });
      const data = await response.json();

      // Suponiendo que la respuesta incluye una URL o datos de imagen
      return data.data[0].url; // Ajusta esto según el formato de respuesta de DALL-E
  } catch (error) {
      console.error("Error al generar imagen con DALL-E:", error);
      throw error;
  }
}

module.exports = {
  runAssistant,
  generateImageWithDalle
};