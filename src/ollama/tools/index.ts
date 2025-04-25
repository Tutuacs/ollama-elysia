import { z } from "zod";
import { Tool } from "../types";
import { addTwoNumbersClass } from "./addNumbers";

const toolType: Tool = {
    type: "function",
    function: {
        name: "",
        description: "",
        parameters: {
            type: "object",
            properties: {},
            required: undefined
        }
    }
}

const toolClassInterface = {
    toolType: toolType,
    toolSchema: z.object({}),
    main: (args: any) => { },
    validateArgs: (args: any) => { }
}

const addTwoNumbersTool = new addTwoNumbersClass();

export const toolsMap = new Map<string, typeof toolClassInterface>();
    toolsMap.set("addTwoNumbers", addTwoNumbersTool);

export const tools: Tool[] = [
    addTwoNumbersTool.toolType,
]
