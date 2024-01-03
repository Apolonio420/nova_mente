const { OpenAIApi, Configuration } = require('openai');
require('dotenv').config({ path: '../../.env' });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const fileId = "file-5vy2HRBK6Zcy1ZA5zn3O49Xy"; // ID del archivo subido

async function createAssistant() {
    try {
        const response = await openai.beta.assistants.create({
            model: "gpt-3.5-turbo",
            instructions: "Recibe descripciones de usuarios para diseños de remeras y optimiza estos prompts para la generación de imágenes con DALL-E. Considera los estilos y parámetros proporcionados y aplica el conocimiento del archivo PDF subido para crear prompts efectivos y creativos. Asegúrate de que los prompts generados sean adecuados para diseños de remeras y estén dentro de un contenedor visual como un círculo o cuadrado.",
            file_ids: [fileId],
        });
        return response.data.id; // Retorna el ID del asistente creado
    } catch (error) {
        console.error("Error al crear el asistente:", error);
        throw error;
    }
}

async function runAssistant(assistantId, userPrompt) {
    try {
        const response = await openai.beta.assistants.run({
            assistant_id: assistantId,
            inputs: [userPrompt],
        });
        return response.data.choices[0].message.content; // Retorna el prompt optimizado
    } catch (error) {
        console.error("Error al ejecutar el asistente:", error);
        throw error;
    }
}

module.exports = {
    createAssistant,
    runAssistant,
};
