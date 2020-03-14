import { RsqlTokenType } from './rsql-token-type';
import { RsqlTokenizer } from './rsql-tokenizer';

describe('RsqlTokenizer', () => {
  let unit: RsqlTokenizer;

  beforeEach(() => {
    unit = RsqlTokenizer.getInstance();
  });

  it('should tokenize rsql', () => {
    const result = unit.tokenize('string_under-score*more009AbBa');
    expect(result).toEqual([
      { type: RsqlTokenType.Paren, value: '(' },
      { type: RsqlTokenType.Space, value: '   ' },
      { type: RsqlTokenType.Paren, value: ')' },
    ]);
  });
});
