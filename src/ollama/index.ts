import ollama, { ToolCall } from 'ollama';
import { tools, toolsMap } from './tools';
import { Message, Model, Tool } from './types';
import { addTwoNumbersTool, addTwoNumbersToolType } from './tools/addNumbers';

export class Ollama {

    public messages: Message[] = [];
    private systemMessage: Message = {
        role: 'system',
        content: 'You are a helpful assistant, use the tools only if needed and it make sense!',
    };

    private model: Model;
    private tools: Tool[] = [];
    private toolMap: Map<string, any> = new Map();

    constructor() {
        this.messages = [];
        this.model = 'llama3.1';
        this.tools = tools;
        this.toolMap = toolsMap;
    }

    async chat(message: Message) {
        this.messages.push(message);
        if (this.messages.length > 3) {
            this.messages.shift();
        }

        const response = await ollama.chat({ model: this.model, messages: [this.systemMessage, ...this.messages], tools: this.tools });
        // console.log('Response: ', response);

        if (response.message!.tool_calls && response.message!.tool_calls.length > 0) {
            const mergedMessages = [this.systemMessage, ...this.messages];
            const toolResponses = await this.toolCall(response.message.tool_calls);
            if (toolResponses.length > 0) {
                mergedMessages.push(...toolResponses);
            }

            const msg = await ollama.chat({ model: this.model, messages: mergedMessages });
            // console.log('Last Message: ', msg);
            this.messages.push({ content: msg.message?.content, role: 'assistant' });
            return msg;
        }

        this.messages.push({ content: response.message?.content, role: 'assistant' });
        return response;
    }

    async toolCall(toolCalls: ToolCall[]): Promise<Message[]> {
        const toolMessages: Message[] = [];

        for (const toolCall of toolCalls) {
            const { name, arguments: args } = toolCall.function;

            let toolArgs: any;
            try {
                toolArgs = await this.parseArgs(name, args);
                if (toolArgs === undefined) {
                    continue
                }
            } catch (error) {
                continue;
            }

            const fn = this.toolMap.get(name);
            if (fn) {
                const result = await fn(toolArgs);
                toolMessages.push({
                    role: 'tool',
                    content: JSON.stringify(result),
                });
            }
        }

        return toolMessages;
    }

    async parseArgs(name: string, args: { [key: string]: any }) {
        let arg: { [key: string]: any } = {};

        // put args in arg
        for (const key in args) {
            if (args.hasOwnProperty(key)) {
                arg[key] = args[key];
            }
        }

        // parse arg to the type of the addTwoNumbersTool
        if (name === 'addTwoNumbers') {
            const parsed = addTwoNumbersTool.safeParse(arg);
            if (!parsed.success) {
                return undefined;
            }
            return parsed.data as addTwoNumbersToolType;
        }

        return undefined;
    }

}