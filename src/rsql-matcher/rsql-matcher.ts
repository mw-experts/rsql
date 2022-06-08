import { deepFindProperty } from '../helpers/deep-find-property';
import {
  RsqlAstBasicExpressionNode,
  RsqlAstBasicListExpressionNode,
  RsqlAstCompositeExpressionNode,
  RsqlAstNode,
  RsqlAstRootNode,
} from '../rsql-parser/entities/rsql-ast-node';
import { RsqlAstNodeType } from '../rsql-parser/entities/rsql-ast-node-type';
import { RsqlParser } from '../rsql-parser/rsql-parser';
import { RsqlTokenType } from '../rsql-tokenizer/entities/rsql-token-type';
import { RsqlTokenizer } from '../rsql-tokenizer/rsql-tokenizer';
import { Token } from '../tokenizer/entities/token';

export class RsqlMatcher {
  private static instance: RsqlMatcher;

  static getInstance(): RsqlMatcher {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }

  private tokenizer: RsqlTokenizer;

  private parser: RsqlParser;

  private constructor() {
    this.tokenizer = RsqlTokenizer.getInstance();
    this.parser = RsqlParser.getInstance();
  }

  match<T>(rsql: string, item: T): boolean {
    const tokens: Token<RsqlTokenType>[] = this.tokenizer.tokenize(rsql);
    const ast: RsqlAstRootNode = this.parser.parse(tokens);
    return this.matchWithPreparedAst(ast, item);
  }

  matchWithPreparedAst<T>(ast: RsqlAstRootNode, item: T): boolean {
    return this.traverse<T>(ast, item);
  }

  private traverse<T>(node: RsqlAstNode, listItem: T): boolean {
    switch (node.type) {
      case RsqlAstNodeType.Root:
        return this.traverse<T>(node.value, listItem);
      case RsqlAstNodeType.CompositeExpression:
        return this.evalCompositeExpression(
          node.operator,
          node.value.map(
            (
              item:
                | RsqlAstCompositeExpressionNode
                | RsqlAstBasicExpressionNode
                | RsqlAstBasicListExpressionNode,
            ) => this.traverse<T>(item, listItem),
          ),
        );
      case RsqlAstNodeType.BasicExpression:
        return this.evalBasicExpression(node, listItem);
      default:
        throw new TypeError(`Unsupported type`);
    }
  }

  private evalCompositeExpression(
    operator: RsqlTokenType.CompositeAndOperator | RsqlTokenType.CompositeOrOperator,
    value: boolean[],
  ): boolean {
    switch (operator) {
      case RsqlTokenType.CompositeAndOperator:
        return value.every(Boolean);
      case RsqlTokenType.CompositeOrOperator:
        return value.some(Boolean);
      default:
        throw new TypeError(`Unsupported operator`);
    }
  }

  private evalBasicExpression(
    node: RsqlAstBasicExpressionNode | RsqlAstBasicListExpressionNode,
    listItem: any,
  ): boolean {
    const data = deepFindProperty(listItem, node.field);
    const stringData = `${data}`.toLowerCase();
    const numberData = Number(data);
    const value = this.getValue(listItem, node.value);
    const numberValue = Number(value);

    let arrData: string[] | null = null;
    if (Array.isArray(data)) {
      arrData = data.map((dataItem: unknown) => `${dataItem}`.toLowerCase());
    }

    switch (node.operator) {
      case RsqlTokenType.BasicEqualOperator:
        if (typeof value === 'string' && value.includes('*')) {
          return this.compareWithWildcard(value.toLowerCase(), stringData);
        } else {
          return value.toString().toLowerCase() === stringData;
        }
      case RsqlTokenType.BasicNotEqualOperator:
        if (typeof value === 'string' && value.includes('*')) {
          return !this.compareWithWildcard(value.toLowerCase(), stringData);
        } else {
          return value.toString().toLowerCase() !== stringData;
        }
      case RsqlTokenType.BasicGreaterOperator:
        return Number.isNaN(numberData) || Number.isNaN(numberValue)
          ? false
          : numberData > numberValue;
      case RsqlTokenType.BasicGreaterOrEqualOperator:
        return Number.isNaN(numberData) || Number.isNaN(numberValue)
          ? false
          : numberData >= numberValue;
      case RsqlTokenType.BasicLessOperator:
        return Number.isNaN(numberData) || Number.isNaN(numberValue)
          ? false
          : numberData < numberValue;
      case RsqlTokenType.BasicLessOrEqualOperator:
        return Number.isNaN(numberData) || Number.isNaN(numberValue)
          ? false
          : numberData <= numberValue;
      case RsqlTokenType.BasicInOperator:
        return (value as string[]).map((item: string) => item.toLowerCase()).includes(stringData);
      case RsqlTokenType.BasicNotInOperator:
        return !(value as string[]).map((item: string) => item.toLowerCase()).includes(stringData);
      case RsqlTokenType.BasicIncludesAllOperator:
        return (
          arrData !== null &&
          (value as string[])
            .map((item: string) => item.toLowerCase())
            .every((val: string) => (arrData as string[]).includes(val))
        );
      case RsqlTokenType.BasicIncludesOneOperator:
        return (
          arrData !== null &&
          (value as string[])
            .map((item: string) => item.toLowerCase())
            .some((val: string) => (arrData as string[]).includes(val))
        );
      default:
        throw new TypeError(`Unsupported operator`);
    }
  }

  private compareWithWildcard(patternWithWildcard: string, data: string): boolean {
    // Escape string for use in Javascript regex
    let pattern = patternWithWildcard.replace(/[.+?^${}()|\[\]\\]/g, '\\$&');

    // Replace wildcard with RegExp
    pattern = pattern.replace(/\*/g, '.*');

    const regexp = new RegExp(`^${pattern}$`);

    return regexp.test(data);
  }

  private getValue(listItem: any, value: string | string[]): typeof value {
    if (Array.isArray(value)) {
      return value.map((el: string): string => deepFindProperty(listItem, el) ?? el);
    }
    return deepFindProperty(listItem, value) ?? value;
  }
}
