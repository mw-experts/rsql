import { parseList } from './parse-list';

describe('parseList', () => {
  it('should parse list', () => {
    const input = 'one,two,three';
    expect(parseList(input)).toEqual(['one', 'two', 'three']);
  });
});
