import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function bytesToMB(bytes: number) {
    const MB = Math.pow(2, 20);
    const mbValue = bytes / MB;
    return mbValue.toFixed(2);
}
