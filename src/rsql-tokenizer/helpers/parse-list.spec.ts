import { parseList } from './parse-list';

describe('parseList', () => {
  it('should parse list', () => {
    expect.hasAssertions();
    const input = 'one,two,three';
    expect(parseList(input)).toStrictEqual(['one', 'two', 'three']);
  });
});
