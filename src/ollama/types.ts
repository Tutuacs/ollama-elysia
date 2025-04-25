export type Tool = {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: {
            type: 'object';
            properties: Record<string, any>;
            required?: string[];
        };
    }
}

export type Message = {
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
}

export type Model = 'llama3.2:1b' | 'llama3.2' | 'llama3.1'