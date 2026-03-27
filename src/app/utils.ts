export function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index
        const j = Math.floor(Math.random() * (i + 1));

        // Swap elements at indices i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export async function wait(forMs: number) {
    await new Promise(resolve => setTimeout(resolve, forMs));
}

export function randomNumber(from: number, to: number): number {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

export function randomGaussian(min: number, max: number): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();

    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10.0 + 0.5;

    if (num < 0 || num > 1) {
        return randomGaussian(min, max);
    }

    return min + num * (max - min);
}