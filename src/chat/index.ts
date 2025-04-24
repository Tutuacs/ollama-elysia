import Elysia, { t } from "elysia";
import { Ollama } from "../ollama";

const ollamaMap = new Map<string, Ollama>();

export const ChatHandler = new Elysia({ name: "Chat", prefix: "/chat", tags: ["Chat"] })
    .decorate('ollama', new Ollama())
    .post("/", async ({ body, ollama }) => {
        const { message } = body as { message: string };
        console.log("Message:", message);
        const response = await ollama.chat({ content: message, role: 'user' });
        return response;
    })
    .ws("/", {
        body: t.String(),
        response: t.String(),
        open(ws) {
            const ollama = new Ollama();
            ollamaMap.set(ws.id, ollama);
            console.log("WebSocket opened:", ws.id);
        },
        async message(ws, message) {
            console.log("mensagem recebida")
            const ollama = ollamaMap.get(ws.id);
            console.log("Ollama:", ollama!.messages);
            const response = await ollama!.chat({ content: message, role: 'user' });
            const responseString = JSON.stringify(response);
            ws.send(responseString);
            // return responseString;
        },
    })