import { Token } from '../entities/token';
import { TokenExtractor } from '../entities/token-extractor';

export class TokenRegexpExtractor<Type> implements TokenExtractor<Type> {
  constructor(
    private type: Type,
    private regexp: RegExp,
    private matchGroup = 0,
    private indexBack = 0,
    private charsBack = 0,
    private postProcessValue = (value: string): string => value,
  ) {}

  extract(input: string, index: number): Token<Type> | null {
    const result: RegExpExecArray | null = this.regexp.exec(input.slice(index - this.indexBack));

    if (result !== null && result.index === 0) {
      return {
        type: this.type,
        value: this.postProcessValue(result[this.matchGroup]),
        origin: result[0],
        charsBack: this.charsBack,
      };
    }

    return null;
  }
}
