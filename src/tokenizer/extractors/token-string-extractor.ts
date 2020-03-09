import { Token } from '../entities/token';
import { TokenExtractor } from '../entities/token-extractor';

export class TokenStringExtractor<Type> implements TokenExtractor<Type> {
  constructor(private type: Type, private value: string) {}

  extract(input: string, index: number): Token<Type> | null {
    if (input.indexOf(this.value) === index) {
      return {
        type: this.type,
        value: this.value,
      };
    }

    return null;
  }
}
