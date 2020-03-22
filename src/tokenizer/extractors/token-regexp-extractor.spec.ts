import { TokenExtractor } from '../entities/token-extractor';
import { TokenRegexpExtractor } from './token-regexp-extractor';

describe('TokenRegexpExtractor', () => {
  describe('METHOD: extract', () => {
    it('should found token when input starts from it', () => {
      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>('paren', /\(|\)/);
      const result = extractor.extract('(hello)', 0);
      expect(result).toEqual({ type: 'paren', value: '(', origin: '(' });
    });

    it('should found token when input starts from space', () => {
      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>('space', /\s+/);
      const result = extractor.extract('  (hello) ', 0);
      expect(result).toEqual({ type: 'space', value: '  ', origin: '  ' });
    });

    it('should found token when input starts from middle', () => {
      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>('coma', /,/);
      expect(extractor.extract('1,2,3', 1)).toEqual({ type: 'coma', value: ',', origin: ',' });
      expect(extractor.extract('1,2,3', 3)).toEqual({ type: 'coma', value: ',', origin: ',' });
    });

    it('should found token group by index', () => {
      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>('word', /"(\w+)"/, 1);
      expect(extractor.extract('"vot""tak"', 0)).toEqual({ type: 'word', value: 'vot', origin: '"vot"' });
    });

    it('should postprocess value', () => {
      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>(
        'word',
        /"(\w+)"/,
        1,
        (value: string) => `$$$${value}$$$`,
      );
      expect(extractor.extract('"vot""tak"', 0)).toEqual({ type: 'word', value: '$$$vot$$$', origin: '"vot"' });
    });

    it('should not found token', () => {
      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>('any', /\s/);
      const result = extractor.extract('string', 0);
      expect(result).toBeNull();
    });
  });
});
