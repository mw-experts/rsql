import { Token } from '../tokenizer/entities/token';
import { TokenRegexpExtractor } from '../tokenizer/extractors/token-regexp-extractor';
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
      .add(new TokenRegexpExtractor(RsqlTokenType.String, /([\w*-])+/))
      .add(new TokenRegexpExtractor(RsqlTokenType.Paren, /\(|\)/))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicOperator, '=='))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicOperator, '!='))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicOperator, '=gt='))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicOperator, '=ge='))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicOperator, '=lt='))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicOperator, '=le='))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicOperator, '=in='))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicOperator, '=out='))
      .add(new TokenRegexpExtractor(RsqlTokenType.CompositeOperator, ';'))
      .add(new TokenRegexpExtractor(RsqlTokenType.CompositeOperator, ','));
  }
}
