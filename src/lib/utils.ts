import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ERROR HANDLER
export function handleError(error: unknown) {
  if (error instanceof Error) {
    // native javascript error e.g. typeerror or rangeerror
    console.log(error.message)
    throw new Error(`Error : ${error}`)
  } else if (typeof error === "string") {
    // string error message
    console.log(error)
    throw new Error(`Error : ${error}`)
  } else {
    // unknown error
    console.log(error)
    throw new Error(`Unknown  Error : ${error}`)
  }
}

