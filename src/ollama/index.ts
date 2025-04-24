import ollama, { ToolCall } from 'ollama';
import { tools, toolsMap } from './tools';
import { Message, Model, Tool } from './types';

export class Ollama {

    public messages: Message[] = [];
    private systemMessage: Message = {
        role: 'system',
        content: 'You are a helpful assistant, use the tools only if needed.',
    };

    private model: Model;
    private tools: Tool[] = [];
    private toolMap: Map<string, any> = new Map();

    constructor() {
        this.messages = [];
        this.model = 'llama3.2:1b';
        this.tools = tools;
        this.toolMap = toolsMap;
    }

    async chat(message: Message) {
        this.messages.push(message);
        if (this.messages.length > 3) {
            this.messages.shift();
        }

        const response = await ollama.chat({model: this.model, messages: this.messages, tools: this.tools});

        if(response.message!.tool_calls && response.message!.tool_calls.length > 0) {
            const toolResponses = await this.toolCall(response.message.tool_calls);
            const mergedMessages = [this.systemMessage, ...this.messages, ...toolResponses];

            const msg = await ollama.chat({model: this.model, messages: mergedMessages, tools: this.tools});
            this.messages.push({content: msg.message?.content, role: 'assistant'});
            return msg;
        }

        const msg = await ollama.chat({model: this.model, messages: [this.systemMessage, ...this.messages], tools: this.tools});
        this.messages.push({content: msg.message?.content, role: 'assistant'});
        return msg;
    }

    async toolCall(toolCalls: ToolCall[]): Promise<Message[]> {
        const toolMessages: Message[] = [];
        for (const toolCall of toolCalls) {
        
            const {name, arguments: args} = toolCall.function;

            const fn = this.toolMap.get(name);
            if (fn) {
                const result = await fn(args);
                const toolMessage: Message = {
                    role: 'tool',
                    content: JSON.stringify(result),
                };
                toolMessages.push(toolMessage);
            }
            else {
                const toolMessage: Message = {
                    role: 'tool',
                    content: `Tool ${name} not found`,
                };
                toolMessages.push(toolMessage);
            }
        }

        return toolMessages
    }

}