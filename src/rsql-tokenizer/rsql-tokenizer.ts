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
      .add(new TokenRegexpExtractor(RsqlTokenType.CompositeOperator, /\s(and)\s/, 1))
      .add(new TokenRegexpExtractor(RsqlTokenType.CompositeOperator, /\s(or)\s/, 1))
      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.String,
          /"((?:[^!"(),;<=>\\]|\\!|\\"|\\\(|\\\)|\\,|\\;|\\<|\\=|\\>|\\)+)"/,
          1,
        ),
      )
      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.String,
          /'((?:[^!'(),;<=>\\]|\\!|\\'|\\\(|\\\)|\\,|\\;|\\<|\\=|\\>|\\)+)'/,
          1,
        ),
      )
      .add(new TokenRegexpExtractor(RsqlTokenType.String, /[^\s!"'(),;<=>\\]+/))
      .add(new TokenRegexpExtractor(RsqlTokenType.Space, /\s+/))
      .add(new TokenRegexpExtractor(RsqlTokenType.Paren, /\(|\)/))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicOperator, /==|!=|=gt=|>|=ge=|>=|=lt=|<|=le=|<=|=in=|=out=/))
      .add(new TokenRegexpExtractor(RsqlTokenType.CompositeOperator, /;|,/));
  }
}
