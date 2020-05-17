import { RsqlFilter } from './rsql-filter';

describe('RsqlFilter', () => {
  let filter: RsqlFilter;

  beforeEach(() => {
    filter = RsqlFilter.getInstance();
  });

  it('should filter array', () => {
    expect.hasAssertions();

    const data = [
      { name: 'Andrey', age: 30 },
      { name: 'Anna', age: 18 },
      { name: 'Alina', age: 22 },
    ];

    expect(filter.filter('age>20;(name==Anna,name==Alina)', data)).toStrictEqual([
      { age: 22, name: 'Alina' },
    ]);
  });

  it('should filter array using nested field', () => {
    expect.hasAssertions();

    const data = [
      { deep: { nested: { field: 555 } } },
      { deep: { nested: { field: 777 } } },
      { deep: {} },
      { deep: { nested: { field: 666 } } },
    ];

    expect(filter.filter('deep.nested.field==777', data)).toStrictEqual([
      { deep: { nested: { field: 777 } } },
    ]);
  });

  it('should filter objects with array property includes all from clause', () => {
    expect.hasAssertions();

    const data = [
      { fieldA: 'a', fieldB: ['s1', 's2', 's3'] },
      { fieldA: 'b', fieldB: ['s2'] },
      { fieldA: 'c', fieldB: ['s3', 's2', 's4'] },
      { fieldA: 'd', fieldB: ['s1'] },
      { fieldA: 'e', fieldB: ['s3', 's5', 's1'] },
    ];

    expect(filter.filter('fieldB=includes-all=(s2,s3)', data)).toStrictEqual([
      { fieldA: 'a', fieldB: ['s1', 's2', 's3'] },
      { fieldA: 'c', fieldB: ['s3', 's2', 's4'] },
    ]);
  });

  it('should filter objects with array property includes any from clause', () => {
    expect.hasAssertions();

    const data = [
      { fieldA: 'a', fieldB: ['s1', 's2', 's3'] },
      { fieldA: 'b', fieldB: ['s2'] },
      { fieldA: 'c', fieldB: ['s3', 's2', 's4'] },
      { fieldA: 'd', fieldB: ['s5'] },
      { fieldA: 'e', fieldB: ['s3', 's5', 's1'] },
    ];

    expect(filter.filter('fieldB=includes-one=(s1,s5)', data)).toStrictEqual([
      { fieldA: 'a', fieldB: ['s1', 's2', 's3'] },
      { fieldA: 'd', fieldB: ['s5'] },
      { fieldA: 'e', fieldB: ['s3', 's5', 's1'] },
    ]);
  });

  it('should filter strings with wildcard', () => {
    expect.hasAssertions();

    const data = [{ key: 'abcdefg' }, { key: 'cde' }, { key: '111fg' }, { key: 'ab222' }];

    expect(filter.filter('key==*cde*', data)).toStrictEqual([{ key: 'abcdefg' }, { key: 'cde' }]);
    expect(filter.filter('key==*fg', data)).toStrictEqual([{ key: 'abcdefg' }, { key: '111fg' }]);
  });

  it('should not filter strings with wildcard', () => {
    expect.hasAssertions();

    const data = [{ key: 'abcdefg' }, { key: 'cde' }, { key: '111fg' }, { key: 'ab222' }];

    expect(filter.filter('key!=*cde*', data)).toStrictEqual([{ key: '111fg' }, { key: 'ab222' }]);
    expect(filter.filter('key!=*fg', data)).toStrictEqual([{ key: 'cde' }, { key: 'ab222' }]);
  });
});
