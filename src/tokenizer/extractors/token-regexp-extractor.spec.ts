import { TokenExtractor } from '../entities/token-extractor';
import { TokenRegexpExtractor } from './token-regexp-extractor';

describe('TokenRegexpExtractor', () => {
  describe('METHOD: extract', () => {
    it('should found token when input starts from it', () => {
      expect.hasAssertions();

      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>('paren', /\(|\)/);
      const result = extractor.extract('(hello)', 0);
      expect(result).toStrictEqual({
        type: 'paren',
        value: '(',
        origin: '(',
        charsBack: 0,
      });
    });

    it('should found token when input starts from space', () => {
      expect.hasAssertions();

      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>('space', /\s+/);
      const result = extractor.extract('  (hello) ', 0);
      expect(result).toStrictEqual({
        type: 'space',
        value: '  ',
        origin: '  ',
        charsBack: 0,
      });
    });

    it('should found token when input starts from middle', () => {
      expect.hasAssertions();

      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>('coma', /,/);
      expect(extractor.extract('1,2,3', 1)).toStrictEqual({
        type: 'coma',
        value: ',',
        origin: ',',
        charsBack: 0,
      });
      expect(extractor.extract('1,2,3', 3)).toStrictEqual({
        type: 'coma',
        value: ',',
        origin: ',',
        charsBack: 0,
      });
    });

    it('should found token group by index', () => {
      expect.hasAssertions();

      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>(
        'word',
        /"(\w+)"/,
        1,
      );
      expect(extractor.extract('"vot""tak"', 0)).toStrictEqual({
        type: 'word',
        value: 'vot',
        origin: '"vot"',
        charsBack: 0,
      });
    });

    it('should set non zero charsBack', () => {
      expect.hasAssertions();

      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>(
        'coma',
        /,/,
        0,
        0,
        3,
      );
      expect(extractor.extract('1,2,3', 1)).toStrictEqual({
        type: 'coma',
        value: ',',
        origin: ',',
        charsBack: 3,
      });
    });

    it('should set non zero indexBack', () => {
      expect.hasAssertions();

      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>(
        'coma',
        /2(,)/,
        1,
        1,
      );
      expect(extractor.extract('1,2,3', 3)).toStrictEqual({
        type: 'coma',
        value: ',',
        origin: '2,',
        charsBack: 1,
      });
    });

    it('should postprocess value', () => {
      expect.hasAssertions();

      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>(
        'word',
        /"(\w+)"/,
        1,
        0,
        0,
        (value: string) => `$$$${value}$$$`,
      );
      expect(extractor.extract('"vot""tak"', 0)).toStrictEqual({
        type: 'word',
        value: '$$$vot$$$',
        origin: '"vot"',
        charsBack: 0,
      });
    });

    it('should not found token', () => {
      expect.hasAssertions();

      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>('any', /\s/);
      const result = extractor.extract('string', 0);
      expect(result).toBeNull();
    });
  });
});
