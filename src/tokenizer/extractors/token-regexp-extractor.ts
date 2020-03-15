import { Token } from '../entities/token';
import { TokenExtractor } from '../entities/token-extractor';

export class TokenRegexpExtractor<Type> implements TokenExtractor<Type> {
  private regexp: RegExp;

  constructor(private type: Type, regexp: RegExp | string, private matchIndex = 0) {
    if (!regexp) {
      throw new Error('RegExp should not be empty');
    }

    this.regexp = new RegExp(regexp);
  }

  extract(input: string, index: number): Token<Type> | null {
    const result: RegExpExecArray | null = this.regexp.exec(input.slice(index));

    if (result !== null && result.index === 0) {
      return {
        type: this.type,
        value: result[this.matchIndex],
        origin: result[0],
      };
    }

    return null;
  }
}
