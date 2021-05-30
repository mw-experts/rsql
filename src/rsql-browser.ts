import { RsqlMatcher } from './rsql-matcher/rsql-matcher';
import { RsqlFilter } from './rsql-filter/rsql-filter';
import { RsqlTokenizer } from './rsql-tokenizer/rsql-tokenizer';
import { RsqlParser } from './rsql-parser/rsql-parser';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

window.rsql = {
  RsqlTokenizer,
  RsqlParser,
  RsqlMatcher,
  RsqlFilter,
};
