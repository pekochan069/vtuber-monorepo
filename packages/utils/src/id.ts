import { customAlphabet } from "nanoid";

export const generateId = customAlphabet("1234567890abcdef", 20);
export { nanoid } from "nanoid";
