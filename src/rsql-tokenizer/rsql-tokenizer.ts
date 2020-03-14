import { Token } from '../tokenizer/entities/token';
import { TokenRegexpExtractor } from '../tokenizer/extractors/token-regexp-extractor';
import { TokenStringExtractor } from '../tokenizer/extractors/token-string-extractor';
import { Tokenizer } from '../tokenizer/tokenizer';
import { RsqlTokenType } from './rsql-token-type';

export class RsqlTokenizer {
  private static instance: RsqlTokenizer;

  static getInstance(): RsqlTokenizer {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }

  private tokenizer: Tokenizer<RsqlTokenType>;

  private constructor() {
    this.tokenizer = RsqlTokenizer.generateTokenizer();
  }

  tokenize(input: string): Token<RsqlTokenType>[] {
    return this.tokenizer.tokenize(input);
  }

  private static generateTokenizer(): Tokenizer<RsqlTokenType> {
    const tokenizer = new Tokenizer<RsqlTokenType>();

    return tokenizer
      .add(new TokenRegexpExtractor(RsqlTokenType.Space, /\s+/))
      .add(new TokenRegexpExtractor(RsqlTokenType.String, /([\w*-])+/))
      .add(new TokenRegexpExtractor(RsqlTokenType.Paren, /\(|\)/))
      .add(new TokenStringExtractor(RsqlTokenType.BasicOperator, '=='))
      .add(new TokenStringExtractor(RsqlTokenType.BasicOperator, '!='))
      .add(new TokenStringExtractor(RsqlTokenType.BasicOperator, '=gt='))
      .add(new TokenStringExtractor(RsqlTokenType.BasicOperator, '=ge='))
      .add(new TokenStringExtractor(RsqlTokenType.BasicOperator, '=lt='))
      .add(new TokenStringExtractor(RsqlTokenType.BasicOperator, '=le='))
      .add(new TokenStringExtractor(RsqlTokenType.BasicOperator, '=in='))
      .add(new TokenStringExtractor(RsqlTokenType.BasicOperator, '=out='))
      .add(new TokenStringExtractor(RsqlTokenType.CompositeOperator, ';'))
      .add(new TokenStringExtractor(RsqlTokenType.CompositeOperator, ','));
  }
}
