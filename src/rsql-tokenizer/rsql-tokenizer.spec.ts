import { RsqlTokenType } from './rsql-token-type';
import { RsqlTokenizer } from './rsql-tokenizer';

describe('RsqlTokenizer', () => {
  let unit: RsqlTokenizer;

  beforeEach(() => {
    unit = RsqlTokenizer.getInstance();
  });

  it('should tokenize rsql', () => {
    const result = unit.tokenize(
      'genres=in=(sci-fi,action);genres=out=(romance,animated,horror),director==Que*Tarantino',
    );
    expect(result).toEqual([
      {
        type: RsqlTokenType.String,
        value: 'genres',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '=in=',
      },
      {
        type: RsqlTokenType.Paren,
        value: '(',
      },
      {
        type: RsqlTokenType.String,
        value: 'sci-fi',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ',',
      },
      {
        type: RsqlTokenType.String,
        value: 'action',
      },
      {
        type: RsqlTokenType.Paren,
        value: ')',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ';',
      },

      {
        type: RsqlTokenType.String,
        value: 'genres',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '=out=',
      },
      {
        type: RsqlTokenType.Paren,
        value: '(',
      },
      {
        type: RsqlTokenType.String,
        value: 'romance',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ',',
      },
      {
        type: RsqlTokenType.String,
        value: 'animated',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ',',
      },
      {
        type: RsqlTokenType.String,
        value: 'horror',
      },
      {
        type: RsqlTokenType.Paren,
        value: ')',
      },
      {
        type: RsqlTokenType.CompositeOperator,
        value: ',',
      },
      {
        type: RsqlTokenType.String,
        value: 'director',
      },
      {
        type: RsqlTokenType.BasicOperator,
        value: '==',
      },
      {
        type: RsqlTokenType.String,
        value: 'Que*Tarantino',
      },
    ]);
  });
});
