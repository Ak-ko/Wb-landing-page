import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getArrayDifferences<T>(array1: T[], array2: T[]) {
    const set1 = new Set(array1);
    const set2 = new Set(array2);

    const differences = [...array1.filter((x) => !set2.has(x)), ...array2.filter((x) => !set1.has(x))];

    const newItems = differences.filter((x) => set2.has(x));
    const removedItems = differences.filter((x) => !set2.has(x));

    return { newItems, removedItems };
}

export function calculateReadingTime(content: string): number {
    if (!content) return 1;
    const wordCount = content
        .trim()
        .replace(/<[^>]+>/g, '')
        .split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return Math.max(1, minutes);
}
