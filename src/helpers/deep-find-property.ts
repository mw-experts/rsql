export function deepFindProperty<T>(object: object, path: string, separator = '.'): T | null {
  return path
    .split(separator)
    .reduce(
      (result: any, key: string) =>
        (result !== undefined && result[key] !== undefined ? result[key] : null),
      object,
    );
}
