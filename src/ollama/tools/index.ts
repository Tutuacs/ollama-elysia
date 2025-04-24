import { Tool } from "../types";
import { addTwoNumbers } from "./addNumbers";

export const tools: Tool[] = [
    {
        type: "function",
        function: {
            name: "addTwoNumbers",
            description: "Usar quando o usuário pedir para somar dois números inteiros, você deve passar os dois números, a resposta será o resultado da soma.",
            parameters: {
                type: "object",
                properties: {
                    a: { type: "number", description: "Primeiro número" },
                    b: { type: "number", description: "Segundo número" },
                },
                required: ["a", "b"],
            },
        },
    },
]

export const toolsMap = new Map<string, any>();

toolsMap.set("addTwoNumbers", addTwoNumbers);