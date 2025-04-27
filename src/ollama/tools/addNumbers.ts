import { z } from "zod";
import { Tool } from "../types";

const addTwoNumbersTool = z.object({
    a: z.coerce.number(),
    b: z.coerce.number(),
}, { description: "two numbers to add" })

export class addTwoNumbersClass {

    public toolType: Tool;
    public toolSchema;

    constructor() {
        this.toolType = {
            type: "function",
            function: {
                name: "addTwoNumbers",
                description: "On this tool you can add two numbers and get the result of the sum. use only when the users need to sum something and get the result",
                parameters: {
                    type: "object",
                    properties: {
                        a: { type: "number", description: "first value" },
                        b: { type: "number", description: "second value" },
                    },
                    required: ["a", "b"],
                },
            },
        }

        this.toolSchema = addTwoNumbersTool;
    }

    public main({ a, b }: z.infer<typeof this.toolSchema>) {
        console.log("Adding two numbers:", a, b);
        const total = parseInt(a.toString(), 10) + parseInt(b.toString(), 10);
        console.log("Total:", total);
        return total
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