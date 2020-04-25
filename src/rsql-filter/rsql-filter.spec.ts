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
});
