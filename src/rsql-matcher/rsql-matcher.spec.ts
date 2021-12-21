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
});
