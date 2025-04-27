import { z } from "zod";
import { Tool } from "../types";

export class SearchProductsClass {
    public toolType: Tool;
    public toolSchema;

    constructor() {
        this.toolType = {
            type: "function",
            function: {
                name: "searchProducts",
                description: "On this tool you can search recomended produts to the user.",
                parameters: {
                    type: "object",
                    properties: {
                        clientId: { type: "string", description: "id of the client" },
                    },
                    required: ["clientId"],
                },
            },
        }

        this.toolSchema = z.object({
            clientId: z.string(),
        }, { description: "search for products" });
    }

    public main({ clientId }: z.infer<typeof this.toolSchema>) {
        console.log("Searching for products:", clientId);

        const products = [
            { id: 1, name: "Web Cam", price: 10 },
            { id: 2, name: "Microphone", price: 20 },
            { id: 3, name: "Dildo", price: 30 },
            { id: 4, name: "Vibrator", price: 40 },
            { id: 5, name: "Headphones", price: 50 },
            { id: 6, name: "Mouse", price: 60 },
            { id: 7, name: "Keyboard", price: 70 },
            { id: 8, name: "Monitor", price: 80 },
            { id: 9, name: "Laptop", price: 90 },
            { id: 10, name: "Phone", price: 100 },
            { id: 11, name: "Tablet", price: 110 },
            { id: 12, name: "Smart Watch", price: 120 },
            { id: 13, name: "Smart TV", price: 130 },
            { id: 14, name: "Game Console", price: 140 },
            { id: 15, name: "VR Headset", price: 150 },
            { id: 16, name: "Drone", price: 160 },
            { id: 17, name: "Camera", price: 170 },
            { id: 18, name: "Action Camera", price: 180 },
            { id: 19, name: "GoPro", price: 190 },
            { id: 20, name: "Tripod", price: 200 },
            { id: 21, name: "Lighting Kit", price: 210 },
            { id: 22, name: "Green Screen", price: 220 },
            { id: 23, name: "Capture Card", price: 230 },
            { id: 24, name: "Audio Interface", price: 240 },
            { id: 25, name: "Mixer", price: 250 },
            { id: 26, name: "Headset", price: 260 },
            { id: 27, name: "Sound Card", price: 270 },
            { id: 28, name: "Speakers", price: 280 },
            { id: 29, name: "Subwoofer", price: 290 },
            { id: 30, name: "Amplifier", price: 300 },
        ]

        return products;
    }

    public validateArgs(args: any) {
        let arg: { [key: string]: any } = {};

        // put args in arg
        for (const key in args) {
            if (args.hasOwnProperty(key)) {
                arg[key] = args[key];
            }
        }

        console.log("Validating args:", arg);

        const result = this.toolSchema.safeParse(arg);
        if (!result.success) {
            console.error("Invalid arguments:", result.error.format());
            return undefined;
        }
        return result.data;
    }
}