import { Tool } from "../types";
import { addTwoNumbers } from "./addNumbers";

export const tools: Tool[] = [
    {
        type: "function",
        function: {
            name: "addTwoNumbers",
            description: "NEVER call addTwoNumbers unless the user explicitly asks: “sum X and Y”.If not, respond normally and do not refer to any tool.",
            parameters: {
                type: "object",
                properties: {
                    a: { type: "number", description: "first value"},
                    b: { type: "number", description: "second value"},
                },
                required: ["a", "b"],
            },
        },
    },
]

export const toolsMap = new Map<string, any>();

toolsMap.set("addTwoNumbers", addTwoNumbers);