import { TokenExtractor } from './entities/token-extractor';
import { Token } from './entities/token';

/**
 * Lexical analysis
 */
export class Tokenizer<Type> {
  private extractors: TokenExtractor<Type>[] = [];

  add(extractor: TokenExtractor<Type>): Tokenizer<Type> {
    this.extractors.push(extractor);
    return this;
  }

  tokenize(input: string): Token<Type>[] {
    const tokens: Token<Type>[] = [];
    let cursor = 0;

    while (cursor < input.length) {
      let isFoundToken = false;

      for (let i = 0; i < this.extractors.length; i++) {
        const token: Token<Type> | null = this.extractors[i].extract(input, cursor);

        if (token !== null) {
          tokens.push(token);
          cursor += token.value.length;
          isFoundToken = true;
          break;
        }
      }

      if (!isFoundToken) {
        throw new TypeError(`Unknown token in string: '${input}' at position ${cursor}`);
      }
    }

    return tokens;
  }
}
