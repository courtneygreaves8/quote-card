import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Parse excess string (e.g. "£250" or "£1,000") to numeric value */
export function parseExcessNum(s: string): number {
  return parseInt(s.replace(/[£,]/g, ""), 10) || 0
}
