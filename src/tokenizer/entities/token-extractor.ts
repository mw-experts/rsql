import { Token } from './token';

export interface TokenExtractor<Type> {
  extract(input: string, index: number): Token<Type> | null;
}
