import { z } from "zod";

export function addTwoNumbers({a, b}: addTwoNumbersToolType) {
    console.log("Adding two numbers:", a, b);
    const total = parseInt(a.toString(), 10) + parseInt(b.toString(), 10);
    console.log("Total:", total);
    return total
}

export const addTwoNumbersTool = z.object({
    a: z.number(),
    b: z.number(),
}, {description: "two numbers to add"})

export type addTwoNumbersToolType = z.infer<typeof addTwoNumbersTool>;