import { RsqlToSqlConverter } from './rsql-to-sql-converter';

describe('RsqlToSqlConverter', () => {
  let converter: RsqlToSqlConverter;

  beforeEach(() => {
    converter = RsqlToSqlConverter.getInstance();
  });

  it('should trim value', () => {
    expect.hasAssertions();

    expect(converter.convert('   age==NULL   ')).toBe('"age" IS NULL');
  });

  it('should return empty value', () => {
    expect.hasAssertions();

    expect(converter.convert('')).toBe('');
    expect(converter.convert('   ')).toBe('');
  });

  it('should convert NULL expressions', () => {
    expect.hasAssertions();

    expect(converter.convert('age==NULL')).toBe('"age" IS NULL');
    expect(converter.convert('age==null')).toBe('"age" IS NULL');

    expect(converter.convert('age!=NULL')).toBe('"age" IS NOT NULL');
    expect(converter.convert('age!=null')).toBe('"age" IS NOT NULL');

    expect(() => converter.convert('age>null')).toThrow(
      'Unsupported operator: BASIC_GREATER_OPERATOR with null value',
    );
    expect(() => converter.convert('age<=NULL')).toThrow(
      'Unsupported operator: BASIC_LESS_OR_EQUAL_OPERATOR with NULL value',
    );
  });

  it('should convert basic expressions with wildcard', () => {
    expect.hasAssertions();

    expect(converter.convert('name==An*')).toBe('"name" LIKE \'An%\'');
    expect(converter.convert('name!=An*rey')).toBe('"name" NOT LIKE \'An%rey\'');
  });

  it('should convert basic expressions', () => {
    expect.hasAssertions();

    expect(converter.convert('name==Andrey')).toBe('"name" = \'Andrey\'');
    expect(converter.convert('name!=Andrey')).toBe('"name" != \'Andrey\'');

    expect(converter.convert('age>16')).toBe('"age" > \'16\'');
    expect(converter.convert('age>=16')).toBe('"age" >= \'16\'');
    expect(converter.convert('age<16')).toBe('"age" < \'16\'');
    expect(converter.convert('age<=16')).toBe('"age" <= \'16\'');

    expect(converter.convert('name=in=(Fero,Jane)')).toBe("\"name\" IN ('Fero', 'Jane')");
    expect(converter.convert('name=out=(Fero,Jane)')).toBe("\"name\" NOT IN ('Fero', 'Jane')");

    expect(() => converter.convert('name=includes-all=(Fero,Jane)')).toThrow(
      'Unsupported operator: BASIC_INCLUDES_ALL_OPERATOR',
    );
    expect(() => converter.convert('name=includes-one=(Fero,Jane)')).toThrow(
      'Unsupported operator: BASIC_INCLUDES_ONE_OPERATOR',
    );
  });

  it('should convert composite expressions', () => {
    expect.hasAssertions();

    expect(converter.convert('name==Andrey;age>16')).toBe(
      '("name" = \'Andrey\' AND "age" > \'16\')',
    );
    expect(converter.convert('name==Andrey,age>16')).toBe(
      '("name" = \'Andrey\' OR "age" > \'16\')',
    );

    expect(converter.convert('name==Andrey or (age>16 and age<25)')).toBe(
      '("name" = \'Andrey\' OR ("age" > \'16\' AND "age" < \'25\'))',
    );
    expect(converter.convert('name=="Kill Bill",year=ge=2000')).toBe(
      '("name" = \'Kill Bill\' OR "year" >= \'2000\')',
    );
  });
});
