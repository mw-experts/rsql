import { RsqlTokenizer } from './rsql-tokenizer';

describe('RsqlTokenizer', () => {
  let unit: RsqlTokenizer;

  beforeEach(() => {
    unit = RsqlTokenizer.getInstance();
  });

  it('should tokenize Field', () => {
    expect.hasAssertions();
    expect(unit.tokenize('long.complex-FIELD_777==')[0]).toStrictEqual({
      charsBack: 2,
      origin: 'long.complex-FIELD_777==',
      type: 'FIELD',
      value: 'long.complex-FIELD_777',
    });
    expect(unit.tokenize('age==')[0]).toStrictEqual({
      charsBack: 2,
      origin: 'age==',
      type: 'FIELD',
      value: 'age',
    });
    expect(unit.tokenize('age!=')[0]).toStrictEqual({
      charsBack: 2,
      origin: 'age!=',
      type: 'FIELD',
      value: 'age',
    });
    expect(unit.tokenize('age>=')[0]).toStrictEqual({
      charsBack: 2,
      origin: 'age>=',
      type: 'FIELD',
      value: 'age',
    });
    expect(unit.tokenize('age<=')[0]).toStrictEqual({
      charsBack: 2,
      origin: 'age<=',
      type: 'FIELD',
      value: 'age',
    });
    expect(unit.tokenize('age=gt=')[0]).toStrictEqual({
      charsBack: 4,
      origin: 'age=gt=',
      type: 'FIELD',
      value: 'age',
    });
    expect(unit.tokenize('age=ge=')[0]).toStrictEqual({
      charsBack: 4,
      origin: 'age=ge=',
      type: 'FIELD',
      value: 'age',
    });
    expect(unit.tokenize('age=lt=')[0]).toStrictEqual({
      charsBack: 4,
      origin: 'age=lt=',
      type: 'FIELD',
      value: 'age',
    });
    expect(unit.tokenize('age=le=')[0]).toStrictEqual({
      charsBack: 4,
      origin: 'age=le=',
      type: 'FIELD',
      value: 'age',
    });
    expect(unit.tokenize('age=in=')[0]).toStrictEqual({
      charsBack: 4,
      origin: 'age=in=',
      type: 'FIELD',
      value: 'age',
    });
    expect(unit.tokenize('age=out=')[0]).toStrictEqual({
      charsBack: 5,
      origin: 'age=out=',
      type: 'FIELD',
      value: 'age',
    });
    expect(unit.tokenize('age>')[0]).toStrictEqual({
      charsBack: 1,
      origin: 'age>',
      type: 'FIELD',
      value: 'age',
    });
    expect(unit.tokenize('age<')[0]).toStrictEqual({
      charsBack: 1,
      origin: 'age<',
      type: 'FIELD',
      value: 'age',
    });
    expect(unit.tokenize('age=includes-all=')[0]).toStrictEqual({
      charsBack: 14,
      origin: 'age=includes-all=',
      type: 'FIELD',
      value: 'age',
    });
    expect(unit.tokenize('age=includes-one=')[0]).toStrictEqual({
      charsBack: 14,
      origin: 'age=includes-one=',
      type: 'FIELD',
      value: 'age',
    });
  });

  it('should tokenize Value in double quotes', () => {
    expect.hasAssertions();
    expect(unit.tokenize('field=="Mike\'s car"')[2]).toStrictEqual({
      charsBack: 2,
      origin: '=="Mike\'s car"',
      type: 'VALUE',
      value: "Mike's car",
    });
    expect(unit.tokenize('age=="1"')[2]).toStrictEqual({
      charsBack: 2,
      origin: '=="1"',
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize('age!="1 2"')[2]).toStrictEqual({
      charsBack: 2,
      origin: '!="1 2"',
      type: 'VALUE',
      value: '1 2',
    });
    expect(unit.tokenize('age<="1\'2"')[2]).toStrictEqual({
      charsBack: 2,
      origin: '<="1\'2"',
      type: 'VALUE',
      value: "1'2",
    });
    expect(unit.tokenize('age=gt="1"')[2]).toStrictEqual({
      charsBack: 4,
      origin: '=gt="1"',
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize('age=ge="1 2"')[2]).toStrictEqual({
      charsBack: 4,
      origin: '=ge="1 2"',
      type: 'VALUE',
      value: '1 2',
    });
    expect(unit.tokenize('age=le="1\'2"')[2]).toStrictEqual({
      charsBack: 4,
      origin: '=le="1\'2"',
      type: 'VALUE',
      value: "1'2",
    });
    expect(unit.tokenize('age<"1"')[2]).toStrictEqual({
      charsBack: 1,
      origin: '<"1"',
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize('age>"1"')[2]).toStrictEqual({
      charsBack: 1,
      origin: '>"1"',
      type: 'VALUE',
      value: '1',
    });
  });

  it('should tokenize Value in single quotes', () => {
    expect.hasAssertions();
    expect(unit.tokenize("field=='Symbol \" is used here'")[2]).toStrictEqual({
      charsBack: 2,
      origin: "=='Symbol \" is used here'",
      type: 'VALUE',
      value: 'Symbol " is used here',
    });
    expect(unit.tokenize("age=='1'")[2]).toStrictEqual({
      charsBack: 2,
      origin: "=='1'",
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize("age!='1 2'")[2]).toStrictEqual({
      charsBack: 2,
      origin: "!='1 2'",
      type: 'VALUE',
      value: '1 2',
    });
    expect(unit.tokenize("age<='1\"2'")[2]).toStrictEqual({
      charsBack: 2,
      origin: "<='1\"2'",
      type: 'VALUE',
      value: '1"2',
    });
    expect(unit.tokenize("age=gt='1'")[2]).toStrictEqual({
      charsBack: 4,
      origin: "=gt='1'",
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize("age=ge='1 2'")[2]).toStrictEqual({
      charsBack: 4,
      origin: "=ge='1 2'",
      type: 'VALUE',
      value: '1 2',
    });
    expect(unit.tokenize("age=le='1\"2'")[2]).toStrictEqual({
      charsBack: 4,
      origin: "=le='1\"2'",
      type: 'VALUE',
      value: '1"2',
    });
    expect(unit.tokenize("age>'1'")[2]).toStrictEqual({
      charsBack: 1,
      origin: ">'1'",
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize("age<'1'")[2]).toStrictEqual({
      charsBack: 1,
      origin: "<'1'",
      type: 'VALUE',
      value: '1',
    });
  });

  it('should tokenize Value no quotes', () => {
    expect.hasAssertions();
    expect(unit.tokenize('field==VERY_strange-777-value.*')[2]).toStrictEqual({
      charsBack: 2,
      origin: '==VERY_strange-777-value.*',
      type: 'VALUE',
      value: 'VERY_strange-777-value.*',
    });
    expect(unit.tokenize('age==1')[2]).toStrictEqual({
      charsBack: 2,
      origin: '==1',
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize('age!=1')[2]).toStrictEqual({
      charsBack: 2,
      origin: '!=1',
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize('age>=1')[2]).toStrictEqual({
      charsBack: 2,
      origin: '>=1',
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize('age<=1')[2]).toStrictEqual({
      charsBack: 2,
      origin: '<=1',
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize('age=gt=1')[2]).toStrictEqual({
      charsBack: 4,
      origin: '=gt=1',
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize('age=ge=1')[2]).toStrictEqual({
      charsBack: 4,
      origin: '=ge=1',
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize('age=lt=1')[2]).toStrictEqual({
      charsBack: 4,
      origin: '=lt=1',
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize('age=le=1')[2]).toStrictEqual({
      charsBack: 4,
      origin: '=le=1',
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize('age<1')[2]).toStrictEqual({
      charsBack: 1,
      origin: '<1',
      type: 'VALUE',
      value: '1',
    });
    expect(unit.tokenize('age>1')[2]).toStrictEqual({
      charsBack: 1,
      origin: '>1',
      type: 'VALUE',
      value: '1',
    });
  });

  it('should tokenize Value any lang', () => {
    expect.hasAssertions();
    expect(unit.tokenize('(name==北京,name_cn==北京)')).toStrictEqual([
      {
        charsBack: 0,
        origin: '(',
        type: 'PAREN_LEFT',
        value: '(',
      },
      {
        charsBack: 2,
        origin: 'name==',
        type: 'FIELD',
        value: 'name',
      },
      {
        charsBack: 0,
        origin: '==',
        type: 'BASIC_EQUAL_OPERATOR',
        value: '==',
      },
      {
        charsBack: 2,
        origin: '==北京',
        type: 'VALUE',
        value: '北京',
      },
      {
        charsBack: 0,
        origin: ',',
        type: 'COMPOSITE_OR_OPERATOR',
        value: ',',
      },
      {
        charsBack: 2,
        origin: 'name_cn==',
        type: 'FIELD',
        value: 'name_cn',
      },
      {
        charsBack: 0,
        origin: '==',
        type: 'BASIC_EQUAL_OPERATOR',
        value: '==',
      },
      {
        charsBack: 2,
        origin: '==北京',
        type: 'VALUE',
        value: '北京',
      },
      {
        charsBack: 0,
        origin: ')',
        type: 'PAREN_RIGHT',
        value: ')',
      },
    ]);
  });

  it('should tokenize lists', () => {
    expect.hasAssertions();
    expect(unit.tokenize('age=in=("1","2","3")')[2]).toStrictEqual({
      charsBack: 4,
      origin: '=in=("1","2","3")',
      type: 'VALUE_LIST',
      value: ['1', '2', '3'],
    });
    expect(unit.tokenize('age=out=("1","2","3")')[2]).toStrictEqual({
      charsBack: 5,
      origin: '=out=("1","2","3")',
      type: 'VALUE_LIST',
      value: ['1', '2', '3'],
    });
    expect(unit.tokenize('age=includes-all=("1","2","3")')[2]).toStrictEqual({
      charsBack: 14,
      origin: '=includes-all=("1","2","3")',
      type: 'VALUE_LIST',
      value: ['1', '2', '3'],
    });
    expect(unit.tokenize('age=includes-one=("1","2","3")')[2]).toStrictEqual({
      charsBack: 14,
      origin: '=includes-one=("1","2","3")',
      type: 'VALUE_LIST',
      value: ['1', '2', '3'],
    });
    expect(unit.tokenize("age=in=('1','2','3')")[2]).toStrictEqual({
      charsBack: 4,
      origin: "=in=('1','2','3')",
      type: 'VALUE_LIST',
      value: ['1', '2', '3'],
    });
    expect(unit.tokenize("age=out=('1','2','3')")[2]).toStrictEqual({
      charsBack: 5,
      origin: "=out=('1','2','3')",
      type: 'VALUE_LIST',
      value: ['1', '2', '3'],
    });
    expect(unit.tokenize("age=includes-all=('1','2','3')")[2]).toStrictEqual({
      charsBack: 14,
      origin: "=includes-all=('1','2','3')",
      type: 'VALUE_LIST',
      value: ['1', '2', '3'],
    });
    expect(unit.tokenize("age=includes-one=('1','2','3')")[2]).toStrictEqual({
      charsBack: 14,
      origin: "=includes-one=('1','2','3')",
      type: 'VALUE_LIST',
      value: ['1', '2', '3'],
    });
    expect(unit.tokenize('age=in=(1,2,3)')[2]).toStrictEqual({
      charsBack: 4,
      origin: '=in=(1,2,3)',
      type: 'VALUE_LIST',
      value: ['1', '2', '3'],
    });
    expect(unit.tokenize('age=out=(1,2,3)')[2]).toStrictEqual({
      charsBack: 5,
      origin: '=out=(1,2,3)',
      type: 'VALUE_LIST',
      value: ['1', '2', '3'],
    });
    expect(unit.tokenize('age=includes-all=(1,2,3)')[2]).toStrictEqual({
      charsBack: 14,
      origin: '=includes-all=(1,2,3)',
      type: 'VALUE_LIST',
      value: ['1', '2', '3'],
    });
    expect(unit.tokenize('age=includes-one=(1,2,3)')[2]).toStrictEqual({
      charsBack: 14,
      origin: '=includes-one=(1,2,3)',
      type: 'VALUE_LIST',
      value: ['1', '2', '3'],
    });
  });

  it('should tokenize parens', () => {
    expect.hasAssertions();
    const result = unit.tokenize('(age>=5;age<=25)');
    expect(result[0]).toStrictEqual({
      charsBack: 0,
      origin: '(',
      type: 'PAREN_LEFT',
      value: '(',
    });
    expect(result[8]).toStrictEqual({
      charsBack: 0,
      origin: ')',
      type: 'PAREN_RIGHT',
      value: ')',
    });
  });

  it('should tokenize composite operators', () => {
    expect.hasAssertions();
    expect(unit.tokenize('age>=5 and age<=25')[3]).toStrictEqual({
      charsBack: 0,
      origin: ' and ',
      type: 'COMPOSITE_AND_OPERATOR',
      value: 'and',
    });
    expect(unit.tokenize('age>=5 or age<=25')[3]).toStrictEqual({
      charsBack: 0,
      origin: ' or ',
      type: 'COMPOSITE_OR_OPERATOR',
      value: 'or',
    });
    expect(unit.tokenize('age>=5;age<=25')[3]).toStrictEqual({
      charsBack: 0,
      origin: ';',
      type: 'COMPOSITE_AND_OPERATOR',
      value: ';',
    });
    expect(unit.tokenize('age>=5,age<=25')[3]).toStrictEqual({
      charsBack: 0,
      origin: ',',
      type: 'COMPOSITE_OR_OPERATOR',
      value: ',',
    });
  });

  it('should tokenize basic operators', () => {
    expect.hasAssertions();
    expect(unit.tokenize('age==5')[1]).toStrictEqual({
      charsBack: 0,
      origin: '==',
      type: 'BASIC_EQUAL_OPERATOR',
      value: '==',
    });
    expect(unit.tokenize('age!=5')[1]).toStrictEqual({
      charsBack: 0,
      origin: '!=',
      type: 'BASIC_NOT_EQUAL_OPERATOR',
      value: '!=',
    });
    expect(unit.tokenize('age=gt=5')[1]).toStrictEqual({
      charsBack: 0,
      origin: '=gt=',
      type: 'BASIC_GREATER_OPERATOR',
      value: '=gt=',
    });
    expect(unit.tokenize('age>5')[1]).toStrictEqual({
      charsBack: 0,
      origin: '>',
      type: 'BASIC_GREATER_OPERATOR',
      value: '>',
    });
    expect(unit.tokenize('age=ge=5')[1]).toStrictEqual({
      charsBack: 0,
      origin: '=ge=',
      type: 'BASIC_GREATER_OR_EQUAL_OPERATOR',
      value: '=ge=',
    });
    expect(unit.tokenize('age>=5')[1]).toStrictEqual({
      charsBack: 0,
      origin: '>=',
      type: 'BASIC_GREATER_OR_EQUAL_OPERATOR',
      value: '>=',
    });
    expect(unit.tokenize('age=lt=5')[1]).toStrictEqual({
      charsBack: 0,
      origin: '=lt=',
      type: 'BASIC_LESS_OPERATOR',
      value: '=lt=',
    });
    expect(unit.tokenize('age<5')[1]).toStrictEqual({
      charsBack: 0,
      origin: '<',
      type: 'BASIC_LESS_OPERATOR',
      value: '<',
    });
    expect(unit.tokenize('age=le=5')[1]).toStrictEqual({
      charsBack: 0,
      origin: '=le=',
      type: 'BASIC_LESS_OR_EQUAL_OPERATOR',
      value: '=le=',
    });
    expect(unit.tokenize('age<=5')[1]).toStrictEqual({
      charsBack: 0,
      origin: '<=',
      type: 'BASIC_LESS_OR_EQUAL_OPERATOR',
      value: '<=',
    });
    expect(unit.tokenize('age=in=(5)')[1]).toStrictEqual({
      charsBack: 0,
      origin: '=in=',
      type: 'BASIC_IN_OPERATOR',
      value: '=in=',
    });
    expect(unit.tokenize('age=out=(5)')[1]).toStrictEqual({
      charsBack: 0,
      origin: '=out=',
      type: 'BASIC_NOT_IN_OPERATOR',
      value: '=out=',
    });
  });
});
