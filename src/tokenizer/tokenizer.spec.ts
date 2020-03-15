import { Token } from './entities/token';
import { Tokenizer } from './tokenizer';

type TokenType = 'paren' | 'token2';

describe('Tokenizer', () => {
  let unit: Tokenizer<TokenType>;

  beforeEach(() => {
    unit = new Tokenizer();
  });

  it('should tokenize', () => {
    const result: Token<TokenType>[] = unit
      .add({
        extract: jest.fn().mockReturnValue(null),
      })
      .add({
        extract: jest.fn((input: string, index: number): Token<TokenType> | null => {
          const char = input[index];
          if (char === '(' || char === ')') {
            return {
              type: 'paren',
              value: char,
              origin: char,
            };
          }
          return null;
        }),
      })
      .tokenize('()');

    expect(result).toEqual([
      {
        type: 'paren',
        value: '(',
        origin: '(',
      },
      {
        type: 'paren',
        value: ')',
        origin: ')',
      },
    ]);
  });

  it('should throw error when token not defined', () => {
    expect(() => unit.tokenize('()')).toThrow(TypeError);
  });
});
