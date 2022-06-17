import { RsqlMatcher } from './rsql-matcher';
import { Token } from '../tokenizer/entities/token';
import { RsqlTokenType } from '../rsql-tokenizer/entities/rsql-token-type';
import { RsqlAstRootNode } from '../rsql-parser/entities/rsql-ast-node';
import { RsqlTokenizer } from '../rsql-tokenizer/rsql-tokenizer';
import { RsqlParser } from '../rsql-parser/rsql-parser';

describe('RsqlMatcher', () => {
  let matcher: RsqlMatcher;

  beforeEach(() => {
    ``;
    matcher = RsqlMatcher.getInstance();
  });

  it('should match item', () => {
    expect.hasAssertions();

    const rsql = 'age>20;(name==Anna,name==Alina)';
    const data1 = { name: 'Alina', age: 22 };
    const data2 = { name: 'Andrey', age: 30 };

    expect(matcher.match(rsql, data1)).toBe(true);
    expect(matcher.match(rsql, data2)).toBe(false);
  });

  it('should match item by ast', () => {
    expect.hasAssertions();

    const data1 = { name: 'Alina', age: 22 };
    const data2 = { name: 'Andrey', age: 30 };

    const tokens: Token<RsqlTokenType>[] = RsqlTokenizer.getInstance().tokenize(
      'age>20;(name==Anna,name==Alina)',
    );
    const ast: RsqlAstRootNode = RsqlParser.getInstance().parse(tokens);

    expect(matcher.matchWithPreparedAst(ast, data1)).toBe(true);
    expect(matcher.matchWithPreparedAst(ast, data2)).toBe(false);
  });

  it('should match item by value from item', () => {
    expect.hasAssertions();

    const data = {
      one: {
        age: 20,
      },
      two: {
        age: 20,
      },
      three: {
        age: 30,
      },
    };

    let tokens: Token<RsqlTokenType>[];
    let ast: RsqlAstRootNode;

    tokens = RsqlTokenizer.getInstance().tokenize('one.age==two.age');
    ast = RsqlParser.getInstance().parse(tokens);
    expect(matcher.matchWithPreparedAst(ast, data)).toBe(true);

    tokens = RsqlTokenizer.getInstance().tokenize('one.age==three.age');
    ast = RsqlParser.getInstance().parse(tokens);
    expect(matcher.matchWithPreparedAst(ast, data)).toBe(false);

    tokens = RsqlTokenizer.getInstance().tokenize('one.age==two.age;one.age<three.age');
    ast = RsqlParser.getInstance().parse(tokens);
    expect(matcher.matchWithPreparedAst(ast, data)).toBe(true);
  });

  it('should match item in array', () => {
    expect.hasAssertions();

    const data = {
      elements: [
        {
          age: 20,
        },
        {
          age: 30,
        },
        {
          age: 40,
        }
      ]
    };

    let tokens: Token<RsqlTokenType>[];
    let ast: RsqlAstRootNode;

    tokens = RsqlTokenizer.getInstance().tokenize('elements[1].age==30');
    ast = RsqlParser.getInstance().parse(tokens);
    expect(matcher.matchWithPreparedAst(ast, data)).toBe(true);
  });

  it('should match value in array', () => {
    expect.hasAssertions();

    const data = {
      elements: [
        {
          age: 20,
        },
        {
          age: 30,
        },
        {
          age: 20,
        }
      ]
    };

    let tokens: Token<RsqlTokenType>[];
    let ast: RsqlAstRootNode;

    tokens = RsqlTokenizer.getInstance().tokenize('elements[0].age==elements[2].age');
    ast = RsqlParser.getInstance().parse(tokens);
    expect(matcher.matchWithPreparedAst(ast, data)).toBe(true);
  });

  it('should match empty string', () => {
    expect.hasAssertions();

    const data = {
      item: {
        emptyStringValue: '',
      },
    };

    expect(matcher.match('item.emptyStringValue==""', data)).toBe(true);
    expect(matcher.match("item.emptyStringValue==''", data)).toBe(true);
    expect(matcher.match(`item.emptyStringValue==''`, data)).toBe(true);
    expect(matcher.match(`item.emptyStringValue==""`, data)).toBe(true);

    expect(matcher.match('item.emptyStringValue!=""', data)).toBe(false);
    expect(matcher.match("item.emptyStringValue!=''", data)).toBe(false);
    expect(matcher.match(`item.emptyStringValue!=''`, data)).toBe(false);
    expect(matcher.match(`item.emptyStringValue!=""`, data)).toBe(false);
  });

  it('should match square brackets', () => {
    expect.hasAssertions();

    const data = {
      value: '[Hello World] some text'
    };

    expect(matcher.match('value==*[*', data)).toBe(true);
    expect(matcher.match('value=="*[*"', data)).toBe(true);
    expect(matcher.match(`value=='*[*'`, data)).toBe(true);

    expect(matcher.match('value==*]*', data)).toBe(true);
    expect(matcher.match('value=="*]*"', data)).toBe(true);
    expect(matcher.match(`value=='*]*'`, data)).toBe(true);
  });

  it('should match dot symbol', () => {
    expect.hasAssertions();

    const data = {
      value: 'some.text'
    };

    expect(matcher.match('value==*.*', data)).toBe(true);
  });

  it('should match equal symbold', () => {
    expect.hasAssertions();

    const dataTrue = {
      value: '='
    };

    const dataFalse = {
      value: 'ololo'
    };

    expect(matcher.match('value=="="', dataTrue)).toBe(true);
    expect(matcher.match("value=='='", dataTrue)).toBe(true);
    expect(matcher.match(`value===`, dataTrue)).toBe(true);

    expect(matcher.match('value=="="', dataFalse)).toBe(false);
    expect(matcher.match("value=='='", dataFalse)).toBe(false);
    expect(matcher.match(`value===`, dataFalse)).toBe(false);
  });
});
