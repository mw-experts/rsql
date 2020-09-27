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

export class RsqlToSqlConverter {
  private static instance: RsqlToSqlConverter;

  static getInstance(): RsqlToSqlConverter {
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

  convert(rsql: string): string {
    const input = rsql.trim();

    if (input === '') {
      return '';
    }

    const tokens: Token<RsqlTokenType>[] = this.tokenizer.tokenize(input);
    const ast: RsqlAstRootNode = this.parser.parse(tokens);
    return this.traverse(ast);
  }

  private traverse(node: RsqlAstNode): string {
    switch (node.type) {
      case RsqlAstNodeType.Root:
        return this.traverse(node.value);
      case RsqlAstNodeType.CompositeExpression:
        return this.evalCompositeExpression(
          node.operator,
          node.value.map(
            (
              item:
                | RsqlAstCompositeExpressionNode
                | RsqlAstBasicExpressionNode
                | RsqlAstBasicListExpressionNode,
            ) => this.traverse(item),
          ),
        );
      case RsqlAstNodeType.BasicExpression:
        return !Array.isArray(node.value) && ['null', 'NULL'].includes(node.value)
          ? this.evalBasicNullExpression(node)
          : this.evalBasicNotNullExpression(node);
      default:
        throw new TypeError(`Unsupported type`);
    }
  }

  private evalCompositeExpression(
    operator: RsqlTokenType.CompositeAndOperator | RsqlTokenType.CompositeOrOperator,
    value: string[],
  ): string {
    switch (operator) {
      case RsqlTokenType.CompositeAndOperator:
        return `(${value.join(' AND ')})`;
      case RsqlTokenType.CompositeOrOperator:
        return `(${value.join(' OR ')})`;
      default:
        throw new TypeError(`Unsupported operator: ${operator}`);
    }
  }

  private evalBasicNullExpression(
    node: RsqlAstBasicExpressionNode | RsqlAstBasicListExpressionNode,
  ): string {
    switch (node.operator) {
      case RsqlTokenType.BasicEqualOperator:
        return `"${node.field}" IS NULL`;
      case RsqlTokenType.BasicNotEqualOperator:
        return `"${node.field}" IS NOT NULL`;
      default:
        throw new TypeError(`Unsupported operator: ${node.operator} with ${node.value} value`);
    }
  }

  private evalBasicNotNullExpression(
    node: RsqlAstBasicExpressionNode | RsqlAstBasicListExpressionNode,
  ): string {
    switch (node.operator) {
      case RsqlTokenType.BasicEqualOperator:
        if (node.value.includes('*')) {
          const value = node.value.replace(/\*/g, '%');
          return `"${node.field}" LIKE '${value}'`;
        } else {
          return `"${node.field}" = '${node.value}'`;
        }
      case RsqlTokenType.BasicNotEqualOperator:
        if (node.value.includes('*')) {
          const value = node.value.replace(/\*/g, '%');
          return `"${node.field}" NOT LIKE '${value}'`;
        } else {
          return `"${node.field}" != '${node.value}'`;
        }
      case RsqlTokenType.BasicGreaterOperator:
        return `"${node.field}" > '${node.value}'`;
      case RsqlTokenType.BasicGreaterOrEqualOperator:
        return `"${node.field}" >= '${node.value}'`;
      case RsqlTokenType.BasicLessOperator:
        return `"${node.field}" < '${node.value}'`;
      case RsqlTokenType.BasicLessOrEqualOperator:
        return `"${node.field}" <= '${node.value}'`;
      case RsqlTokenType.BasicInOperator:
        return `"${node.field}" IN (${node.value.map((v: string) => `'${v}'`).join(', ')})`;
      case RsqlTokenType.BasicNotInOperator:
        return `"${node.field}" NOT IN (${node.value.map((v: string) => `'${v}'`).join(', ')})`;
      default:
        throw new TypeError(`Unsupported operator: ${node.operator}`);
    }
  }
}
