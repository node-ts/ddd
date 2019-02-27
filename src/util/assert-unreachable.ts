/**
 * Raises transpile time errors when the tokenizer reaches this function in the code
 */
export function assertUnreachable (_: never): never {
  throw new Error('Unexepected code path')
}
