import { parseListAndTrim } from './parse-list-and-trim';

describe('parseListAndTrim', () => {
  it('should parse and trim', () => {
    expect.hasAssertions();
    const input = '"one","two","three"';
    expect(parseListAndTrim(input)).toStrictEqual(['one', 'two', 'three']);
  });
});
