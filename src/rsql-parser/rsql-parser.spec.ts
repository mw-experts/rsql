import { RsqlTokenizer } from '../rsql-tokenizer/rsql-tokenizer';
import { RsqlParser } from './rsql-parser';

describe('RsqlParser', () => {
  const tokenizer = RsqlTokenizer.getInstance();
  const parser = RsqlParser.getInstance();

  it('should throw error', () => {
    expect.hasAssertions();

    expect(() => parser.parse([])).toThrow('RSQL parsing error, nothing to parse');
  });

  it('should tokenize', () => {
    expect.hasAssertions();

    const tokens = tokenizer.tokenize('((a==1) and c==3 and (b==2 or b==3))');
    const ast = parser.parse(tokens);

    expect(ast).toStrictEqual({
      type: 'ROOT',
      value: {
        operator: 'COMPOSITE_AND_OPERATOR',
        type: 'COMPOSITE_EXPRESSION',
        value: [
          {
            field: 'a',
            operator: 'BASIC_EQUAL_OPERATOR',
            type: 'BASIC_EXPRESSION',
            value: '1',
          },
          {
            operator: 'COMPOSITE_AND_OPERATOR',
            type: 'COMPOSITE_EXPRESSION',
            value: [
              {
                field: 'c',
                operator: 'BASIC_EQUAL_OPERATOR',
                type: 'BASIC_EXPRESSION',
                value: '3',
              },
              {
                operator: 'COMPOSITE_OR_OPERATOR',
                type: 'COMPOSITE_EXPRESSION',
                value: [
                  {
                    field: 'b',
                    operator: 'BASIC_EQUAL_OPERATOR',
                    type: 'BASIC_EXPRESSION',
                    value: '2',
                  },
                  {
                    field: 'b',
                    operator: 'BASIC_EQUAL_OPERATOR',
                    type: 'BASIC_EXPRESSION',
                    value: '3',
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  });
});
