import { Token } from './entities/token';
import { Tokenizer } from './tokenizer';

describe('Tokenizer', () => {
  let tokenizer: Tokenizer<string>;

  beforeEach(() => {
    tokenizer = new Tokenizer();
  });

  it('should tokenize', () => {
    expect.hasAssertions();

    const nullExtractorSpy1 = jest.fn().mockReturnValue(null);
    const nullExtractorSpy2 = jest.fn().mockReturnValue(null);

    const result: Token<string>[] = tokenizer
      .add({
        extract: nullExtractorSpy1,
      })
      .add({
        extract: (input: string, index: number): Token<string> | null => {
          const char = input[index];
          if (char === '(') {
            return {
              type: 'paren',
              value: char,
              origin: char,
              charsBack: 0,
            };
          }
          return null;
        },
      })
      .add({
        extract: (input: string, index: number): Token<string> | null => {
          const char = input[index] + input[index + 1];
          if (char === ');') {
            return {
              type: 'paren',
              value: ')',
              origin: ');',
              charsBack: 1,
            };
          }
          return null;
        },
      })
      .add({
        extract: (input: string, index: number): Token<string> | null => {
          const char = input[index];
          if (char === ';') {
            return {
              type: 'paren',
              value: char,
              origin: char,
              charsBack: 0,
            };
          }
          return null;
        },
      })
      .add({
        extract: nullExtractorSpy2,
      })
      .tokenize('();');

    expect(result).toStrictEqual([
      {
        type: 'paren',
        value: '(',
        origin: '(',
        charsBack: 0,
      },
      {
        type: 'paren',
        value: ')',
        origin: ');',
        charsBack: 1,
      },
      {
        type: 'paren',
        value: ';',
        origin: ';',
        charsBack: 0,
      },
    ]);

    expect(nullExtractorSpy1).toHaveBeenCalledTimes(3);
    expect(nullExtractorSpy2).toHaveBeenCalledTimes(0);
  });

  it('should throw error on bad token properties', () => {
    expect.hasAssertions();

    const tok: Tokenizer<string> = tokenizer.add({
      extract: (input: string, index: number): Token<string> | null => {
        const char = input[index] + input[index + 1];
        if (char === ');') {
          return {
            type: 'paren',
            value: ')',
            origin: ');',
            charsBack: 2,
          };
        }
        return null;
      },
    });

    expect(() => tok.tokenize(');')).toThrow(Error);
  });

  it('should throw error when token not defined', () => {
    expect.hasAssertions();

    expect(() => tokenizer.tokenize('()')).toThrow(TypeError);
  });
});
