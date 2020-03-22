import { Token } from './entities/token';
import { Tokenizer } from './tokenizer';

describe('Tokenizer', () => {
  let tokenizer: Tokenizer<string>;

  beforeEach(() => {
    tokenizer = new Tokenizer();
  });

  it('should tokenize', () => {
    const nullExtractorSpy1 = jest.fn().mockReturnValue(null);
    const nullExtractorSpy2 = jest.fn().mockReturnValue(null);

    const result: Token<string>[] = tokenizer
      .add({
        extract: nullExtractorSpy1,
      })
      .add({
        extract: (input: string, index: number): Token<string> | null => {
          const char = input[index];
          if (char === '(' || char === ')') {
            return {
              type: 'paren',
              value: char,
              origin: char,
            };
          }
          return null;
        },
      })
      .add({
        extract: nullExtractorSpy2,
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

    expect(nullExtractorSpy1).toHaveBeenCalledTimes(2);
    expect(nullExtractorSpy2).toHaveBeenCalledTimes(0);
  });

  it('should throw error when token not defined', () => {
    expect(() => tokenizer.tokenize('()')).toThrow(TypeError);
  });
});
