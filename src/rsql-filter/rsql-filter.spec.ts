import { RsqlFilter } from './rsql-filter';

describe('RsqlFilter', () => {
  let filter: RsqlFilter;

  beforeEach(() => {
    filter = RsqlFilter.getInstance();
  });

  it('should filter array', () => {
    const data = [
      { name: 'Andrey', age: 30 },
      { name: 'Anna', age: 18 },
      { name: 'Alina', age: 22 },
    ];

    expect(filter.filter('(name==Anna,name==Alina);age>20', data)).toEqual([
      { age: 22, name: 'Alina' },
    ]);
  });
});
