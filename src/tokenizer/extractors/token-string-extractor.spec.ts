import { TokenExtractor } from '../entities/token-extractor';
import { TokenStringExtractor } from './token-string-extractor';

describe('TokenStringExtractor', () => {
  describe('METHOD: extract', () => {
    it('should found token when first', () => {
      const extractor: TokenExtractor<string> = new TokenStringExtractor<string>('supertype', 'val');
      const result = extractor.extract('value', 0);
      expect(result).toEqual({ type: 'supertype', value: 'val' });
    });

    it('should found token when in middle', () => {
      const extractor: TokenExtractor<string> = new TokenStringExtractor<string>('supertype', 'lu');
      const result = extractor.extract('value', 2);
      expect(result).toEqual({ type: 'supertype', value: 'lu' });
    });

    it('should not found token', () => {
      const extractor: TokenExtractor<string> = new TokenStringExtractor<string>('supertype', 'val');
      const result = extractor.extract('some string', 0);
      expect(result).toBeNull();
    });
  });
});
