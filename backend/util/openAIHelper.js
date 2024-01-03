const OpenAI = require('openai');
require('dotenv').config({ path: '../../.env' });

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

module.exports = {
    runAssistant,
};
