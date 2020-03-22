export function parseListAndTrim(input: string): string[] {
  return input.split(',').map((value: string) => value.slice(1, -1));
}
