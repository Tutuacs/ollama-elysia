import ollama, { ToolCall } from 'ollama';
import { tools, toolsMap } from './tools';
import { Message, Model, Tool } from './types';

export class Ollama {

    public messages: Message[] = [];
    private systemMessages: Message[] = [
        {
            role: 'system',
            content: `Your name is Babdgi`,
        },
        {
            role: 'system',
            content: `You are a seller, you have to sell products to the user`,
        },
        {
            role: 'system',
            content: `You can consult the tools to get information about the products`,
        },
        {
            role: 'system',
            content: `When you recommend a product, you have to try sell other products related to the first one`,
        },
        // {
        //     role: 'system',
        //     content: `If you dont have tool related to the user question, dont call any tool.`,
        // },
        {
            role: 'system',
            content: `Dont mention if you need or dont tool calls.`,
        },
        {
            role: 'system',
            content: `the clientId of this client is: '1234567890'`,
        },
    ];

    private model: Model;
    private tools: Tool[] = [];
    private toolMap;

    constructor() {
        this.messages = [];
        this.model = 'mistral-nemo';
        this.tools = tools;
        this.toolMap = toolsMap;
    }

    async chat(message: Message) {
        this.messages.push(message);
        if (this.messages.length > 3) {
            this.messages.shift();
        }

        const response = await ollama.chat({ model: this.model, messages: [...this.systemMessages, ...this.messages], tools: this.tools });
        // console.log('Response: ', response);

        if (response.message!.tool_calls && response.message!.tool_calls.length > 0) {
            console.log('Tool Calls')
            const mergedMessages = [...this.systemMessages, ...this.messages];
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