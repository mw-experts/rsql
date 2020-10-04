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
    const field = this.prepareField(node.field);
    const value = Array.isArray(node.value)
      ? node.value.map((v) => this.prepareValue(v))
      : this.prepareValue(node.value);

    switch (node.operator) {
      case RsqlTokenType.BasicEqualOperator:
        if (value.includes('*')) {
          const val = (value as string).replace(/\*/g, '%');
          return `${field} LIKE ${val}`;
        } else {
          return `${field} = ${value}`;
        }
      case RsqlTokenType.BasicNotEqualOperator:
        if (value.includes('*')) {
          const val = (value as string).replace(/\*/g, '%');
          return `${field} NOT LIKE ${val}`;
        } else {
          return `${field} != ${value}`;
        }
      case RsqlTokenType.BasicGreaterOperator:
        return `${field} > ${value}`;
      case RsqlTokenType.BasicGreaterOrEqualOperator:
        return `${field} >= ${value}`;
      case RsqlTokenType.BasicLessOperator:
        return `${field} < ${value}`;
      case RsqlTokenType.BasicLessOrEqualOperator:
        return `${field} <= ${value}`;
      case RsqlTokenType.BasicInOperator:
        return `${field} IN (${(value as string[]).map((v: string) => `${v}`).join(', ')})`;
      case RsqlTokenType.BasicNotInOperator:
        return `${field} NOT IN (${(value as string[]).map((v: string) => `${v}`).join(', ')})`;
      default:
        throw new TypeError(`Unsupported operator: ${node.operator}`);
    }
  }

  private prepareField(field: string): string {
    const parts = field.split('.');

    if (parts.length > 2) {
      throw new TypeError(`Unsupported deep nested value (more than 1 dot): ${field}`);
    }

    return field
      .split('.')
      .map((part: string) => `"${part}"`)
      .join('.');
  }

  private prepareValue(value: string): string {
    const numberValue = Number(value);
    const isNumberValue = !Number.isNaN(numberValue);

    return isNumberValue ? `${value}` : `'${this.escapeValue(value)}'`;
  }

  private escapeValue(value: string): string {
    return value.replace(/'/gi, `''`);
  }
}
