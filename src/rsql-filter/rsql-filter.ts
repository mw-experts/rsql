import { RsqlAstRootNode } from '../rsql-parser/entities/rsql-ast-node';
import { RsqlParser } from '../rsql-parser/rsql-parser';
import { RsqlTokenType } from '../rsql-tokenizer/entities/rsql-token-type';
import { RsqlTokenizer } from '../rsql-tokenizer/rsql-tokenizer';
import { Token } from '../tokenizer/entities/token';
import { RsqlMatcher } from '../rsql-matcher/rsql-matcher';

export class RsqlFilter {
  private static instance: RsqlFilter;

  static getInstance(): RsqlFilter {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }

  private tokenizer: RsqlTokenizer;

  private parser: RsqlParser;

  private matcher: RsqlMatcher;

  private constructor() {
    this.tokenizer = RsqlTokenizer.getInstance();
    this.parser = RsqlParser.getInstance();
    this.matcher = RsqlMatcher.getInstance();
  }

  filter<T>(rsql: string, list: T[]): T[] {
    const tokens: Token<RsqlTokenType>[] = this.tokenizer.tokenize(rsql);
    const ast: RsqlAstRootNode = this.parser.parse(tokens);
    return list.filter((item: T) => this.matcher.matchWithPreparedAst<T>(ast, item));
  }
}
