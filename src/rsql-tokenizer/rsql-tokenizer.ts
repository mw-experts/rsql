import { Token } from '../tokenizer/entities/token';
import { TokenRegexpExtractor } from '../tokenizer/extractors/token-regexp-extractor';
import { Tokenizer } from '../tokenizer/tokenizer';
import { RsqlTokenType } from './entities/rsql-token-type';
import { parseList } from './helpers/parse-list';
import { parseListAndTrim } from './helpers/parse-list-and-trim';

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
    if (typeof input !== 'string') {
      throw new Error(`Input should be correct RSQL string.`);
    }

    return this.tokenizer.tokenize(input);
  }

  private static generateTokenizer(): Tokenizer<RsqlTokenType> {
    const tokenizer = new Tokenizer<RsqlTokenType>();

    return tokenizer
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicEqualOperator, /==/))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicNotEqualOperator, /!=/))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicGreaterOperator, /=gt=/))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicGreaterOrEqualOperator, /=ge=|>=/))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicLessOperator, /=lt=/))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicLessOrEqualOperator, /=le=|<=/))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicInOperator, /=in=/))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicNotInOperator, /=out=/))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicGreaterOperator, />/))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicLessOperator, /</))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicIncludesAllOperator, /=includes-all=/))
      .add(new TokenRegexpExtractor(RsqlTokenType.BasicIncludesOneOperator, /=includes-one=/))

      .add(new TokenRegexpExtractor(RsqlTokenType.CompositeAndOperator, /\s(and)\s/, 1))
      .add(new TokenRegexpExtractor(RsqlTokenType.CompositeOrOperator, /\s(or)\s/, 1))
      .add(new TokenRegexpExtractor(RsqlTokenType.CompositeAndOperator, /;/))
      .add(new TokenRegexpExtractor(RsqlTokenType.CompositeOrOperator, /,/))

      .add(new TokenRegexpExtractor(RsqlTokenType.Field, /([\w-.\[\]]+)(?:==|!=|>=|<=)/, 1, 0, 2))
      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.Field,
          /([\w-.]+)(?:=gt=|=ge=|=lt=|=le=|=in=)/,
          1,
          0,
          4,
        ),
      )
      .add(new TokenRegexpExtractor(RsqlTokenType.Field, /([\w-.\[\]]+)=out=/, 1, 0, 5))
      .add(new TokenRegexpExtractor(RsqlTokenType.Field, /([\w-.\[\]]+)[<>]/, 1, 0, 1))
      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.Field,
          /([\w-.\[\]]+)(?:=includes-all=|=includes-one=)/,
          1,
          0,
          14,
        ),
      )

      .add(new TokenRegexpExtractor(RsqlTokenType.Value, /(?:==|!=)"([\u0020\p{L}\p{N}\u005F\u002D\u002E\u0027\u0028\u0029\u002A\u005B\u005D\u003D]*)"/u, 1, 2))
      .add(new TokenRegexpExtractor(RsqlTokenType.Value, /(?:>=|<=)"([\u0020\p{L}\p{N}\u005F\u002D\u002E\u0027\u0028\u0029\u005B\u005D]+)"/u, 1, 2))
      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.Value,
          /(?:=gt=|=ge=|=lt=|=le=)"([\u0020\p{L}\p{N}\u005F\u002D\u002E\u0027\u0028\u0029\u005B\u005D]+)"/u,
          1,
          4,
        ),
      )
      .add(new TokenRegexpExtractor(RsqlTokenType.Value, /[<>]"([\u0020\p{L}\p{N}\u005F\u002D\u002E\u0027\u0028\u0029\u005B\u005D]+)"/u, 1, 1))

      .add(new TokenRegexpExtractor(RsqlTokenType.Value, /(?:==|!=)'([\u0020\p{L}\p{N}\u005F\u002D\u002E\u0022\u0028\u0029\u002A\u005B\u005D\u003D]*)'/u, 1, 2))
      .add(new TokenRegexpExtractor(RsqlTokenType.Value, /(?:>=|<=)'([\u0020\p{L}\p{N}\u005F\u002D\u002E\u0022\u0028\u0029\u005B\u005D]+)'/u, 1, 2))
      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.Value,
          /(?:=gt=|=ge=|=lt=|=le=)'([\u0020\p{L}\p{N}\u005F\u002D\u002E\u0022\u0028\u0029\u005B\u005D]+)'/u,
          1,
          4,
        ),
      )
      .add(new TokenRegexpExtractor(RsqlTokenType.Value, /[<>]'([\u0020\p{L}\p{N}\u005F\u002D\u002E\u0022\u0028\u0029\u005B\u005D]+)'/u, 1, 1))

      .add(new TokenRegexpExtractor(RsqlTokenType.Value, /(?:==|!=)([\p{L}\p{N}\u005F\u002D\u002E\u002A\u005B\u005D\u003D]+)/u, 1, 2))
      .add(new TokenRegexpExtractor(RsqlTokenType.Value, /(?:>=|<=)([\p{L}\p{N}\u005F\u002D\u002E\u005B\u005D]+)/u, 1, 2))
      .add(new TokenRegexpExtractor(RsqlTokenType.Value, /(?:=gt=|=ge=|=lt=|=le=)([\p{L}\p{N}\u005F\u002D\u002E\u005B\u005D]+)/u, 1, 4))
      .add(new TokenRegexpExtractor(RsqlTokenType.Value, /[<>]([\p{L}\p{N}\u005F\u002D\u002E\u005B\u005D]+)/u, 1, 1))

      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.ValueList,
          /=in=\(((?:"[\u0020\p{L}\p{N}\u005F\u002D\u002E\u0027\u0028\u0029\u005B\u005D]+",)*"[\u0020\p{L}\p{N}\u005F\u002D\u002E\u0027\u0028\u0029\u005B\u005D]+")\)/u,
          1,
          4,
          0,
          parseListAndTrim,
        ),
      )
      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.ValueList,
          /=out=\(((?:"[\u0020\p{L}\p{N}\u005F\u002D\u002E\u0027\u0028\u0029\u005B\u005D]+",)*"[\u0020\p{L}\p{N}\u005F\u002D\u002E\u0027\u0028\u0029\u005B\u005D]+")\)/u,
          1,
          5,
          0,
          parseListAndTrim,
        ),
      )
      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.ValueList,
          /(?:=includes-all=|=includes-one=)\(((?:"[\u0020\p{L}\p{N}\u005F\u002D\u002E\u0027\u0028\u0029\u005B\u005D]+",)*"[\u0020\p{L}\p{N}\u005F\u002D\u002E\u0027\u0028\u0029\u005B\u005D]+")\)/u,
          1,
          14,
          0,
          parseListAndTrim,
        ),
      )

      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.ValueList,
          /=in=\(((?:'[\u0020\p{L}\p{N}\u005F\u002D\u002E\u0022\u0028\u0029\u005B\u005D]+',)*'[\u0020\p{L}\p{N}\u005F\u002D\u002E\u0022\u0028\u0029\u005B\u005D]+')\)/u,
          1,
          4,
          0,
          parseListAndTrim,
        ),
      )
      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.ValueList,
          /=out=\(((?:'[\u0020\p{L}\p{N}\u005F\u002D\u002E\u0022\u0028\u0029\u005B\u005D]+',)*'[\u0020\p{L}\p{N}\u005F\u002D\u002E\u0022\u0028\u0029\u005B\u005D]+')\)/u,
          1,
          5,
          0,
          parseListAndTrim,
        ),
      )
      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.ValueList,
          /(?:=includes-all=|=includes-one=)\(((?:'[\u0020\p{L}\p{N}\u005F\u002D\u002E\u0022\u0028\u0029\u005B\u005D]+',)*'[\u0020\p{L}\p{N}\u005F\u002D\u002E\u0022\u0028\u0029\u005B\u005D]+')\)/u,
          1,
          14,
          0,
          parseListAndTrim,
        ),
      )

      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.ValueList,
          /=in=\(((?:[\p{L}\p{N}\u005F\u002D\u002E\u005B\u005D]+,)*[\p{L}\p{N}\u005F\u002D\u002E\u005B\u005D]+)\)/u,
          1,
          4,
          0,
          parseList,
        ),
      )
      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.ValueList,
          /=out=\(((?:[\p{L}\p{N}\u005F\u002D\u002E\u005B\u005D]+,)*[\p{L}\p{N}\u005F\u002D\u002E\u005B\u005D]+)\)/u,
          1,
          5,
          0,
          parseList,
        ),
      )
      .add(
        new TokenRegexpExtractor(
          RsqlTokenType.ValueList,
          /(?:=includes-all=|=includes-one=)\(((?:[\p{L}\p{N}\u005F\u002D\u002E\u005B\u005D]+,)*[\p{L}\p{N}\u005F\u002D\u002E\u005B\u005D]+)\)/u,
          1,
          14,
          0,
          parseList,
        ),
      )

      .add(new TokenRegexpExtractor(RsqlTokenType.ParenLeft, /\(/))
      .add(new TokenRegexpExtractor(RsqlTokenType.ParenRight, /\)/));
  }
}
