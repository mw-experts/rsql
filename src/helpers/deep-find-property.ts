export function deepFindProperty<T>(object: object, path: string, separator = '.'): T | null {
  return path
    .replace(/\[/g, separator)
    .replace(/\]/g, '')
    .split(separator)
    .reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result: any, key: string) =>
        result !== null && result !== undefined && result[key] !== undefined ? result[key] : null,
      object,
    );
}
