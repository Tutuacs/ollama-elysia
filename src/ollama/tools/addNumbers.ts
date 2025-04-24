export function addTwoNumbers({a, b}: {a: number, b: number}) {
    console.log("Adding two numbers:", a, b);
    const total = parseInt(a.toString(), 10) + parseInt(b.toString(), 10);
    console.log("Total:", total);
    return total
}