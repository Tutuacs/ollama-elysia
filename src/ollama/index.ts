import ollama, { ToolCall } from 'ollama';
import { tools, toolsMap } from './tools';
import { Message, Model, Tool } from './types';

export class Ollama {

    public messages: Message[] = [];
    private systemMessage: Message = {
        role: 'system',
        content: `You are a helpful assistant, when you get a message from 'tool' role its the result of some tool to help you. call the tool only if it makes sense`,
    };

    private model: Model;
    private tools: Tool[] = [];
    private toolMap;

    constructor() {
        this.messages = [];
        this.model = 'llama3.2';
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

            const clss = this.toolMap.get(name);

            if (!clss) {
                console.error(`Tool ${name} not found`);
                continue;
            }

            const arg = clss.validateArgs(args);

            if (arg === undefined) {
                continue
            }

            const result = await clss.main(arg);
            toolMessages.push({
                role: 'tool',
                content: JSON.stringify(result),
            })
        }

        return toolMessages;
    }

}