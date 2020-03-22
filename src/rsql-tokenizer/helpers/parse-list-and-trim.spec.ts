import { parseListAndTrim } from './parse-list-and-trim';

describe('parseListAndTrim', () => {
  it('should parse and trim', () => {
    const input = '"one","two","three"';
    expect(parseListAndTrim(input)).toEqual(['one', 'two', 'three']);
  });
});
