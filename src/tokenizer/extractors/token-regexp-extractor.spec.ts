import { TokenExtractor } from '../entities/token-extractor';
import { TokenRegexpExtractor } from './token-regexp-extractor';

describe('TokenRegexpExtractor', () => {
  describe('METHOD: extract', () => {
    it('should found token when input starts from it', () => {
      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>('paren', /\(|\)/);
      const result = extractor.extract('(hello)', 0);
      expect(result).toEqual({ type: 'paren', value: '(' });
    });

    it('should found token when input starts from space', () => {
      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>('space', /\s/);
      const result = extractor.extract(' (hello) ', 0);
      expect(result).toEqual({ type: 'space', value: ' ' });
    });

    it('should found token when input starts from middle', () => {
      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>('paren', /\(|\)/);
      const result = extractor.extract('1 + (hello)', 4);
      expect(result).toEqual({ type: 'paren', value: '(' });
    });

    it('should not found token', () => {
      const extractor: TokenExtractor<string> = new TokenRegexpExtractor<string>('any', /\s/);
      const result = extractor.extract('string', 0);
      expect(result).toBeNull();
    });
  });
});
