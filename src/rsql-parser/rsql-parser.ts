import { RsqlTokenType } from '../rsql-tokenizer/entities/rsql-token-type';
import { Token } from '../tokenizer/entities/token';
import {
  RsqlAstBasicExpressionNode,
  RsqlAstBasicListExpressionNode,
  RsqlAstCompositeExpressionNode,
  RsqlAstRootNode,
} from './entities/rsql-ast-node';
import { RsqlAstNodeType } from './entities/rsql-ast-node-type';

export class RsqlParser {
  private static instance: RsqlParser;

  static getInstance(): RsqlParser {
    if (!this.instance) {
      this.instance = new this();
    }

    return this.instance;
  }

  private constructor() {}

  private readonly compositeOperatorTypes: RsqlTokenType[] = [
    RsqlTokenType.CompositeAndOperator,
    RsqlTokenType.CompositeOrOperator,
  ];

  parse(input: Token<RsqlTokenType>[]): RsqlAstRootNode {
    return {
      type: RsqlAstNodeType.Root,
      value: this.parseRecursive(input),
    };
  }

  private parseRecursive(
    input: Token<RsqlTokenType>[],
  ): RsqlAstCompositeExpressionNode | RsqlAstBasicExpressionNode | RsqlAstBasicListExpressionNode {
    if (
      !input.some((token: Token<RsqlTokenType>) => {
        return [RsqlTokenType.ParenLeft, RsqlTokenType.ParenRight, ...this.compositeOperatorTypes].includes(token.type);
      }) &&
      input.length === 3
    ) {
      return {
        type: RsqlAstNodeType.BasicExpression,
        operator: input[1].type,
        field: input[0].value,
        value: input[2].value,
      } as RsqlAstBasicExpressionNode | RsqlAstBasicListExpressionNode;
    }

    const leftTokens: Token<RsqlTokenType>[] = [];
    let depthParens = 0;

    for (let i = 0; i < input.length; i++) {
      if (input[i].type === RsqlTokenType.ParenLeft) {
        leftTokens.push(input[i]);
        depthParens++;
        continue;
      }

      if (input[i].type === RsqlTokenType.ParenRight) {
        leftTokens.push(input[i]);
        depthParens--;
        continue;
      }

      if (this.compositeOperatorTypes.includes(input[i].type) && depthParens === 0) {
        return {
          type: RsqlAstNodeType.CompositeExpression,
          operator: input[i].type,
          value: [this.parseRecursive(leftTokens), this.parseRecursive(input.slice(i + 1))],
        } as RsqlAstCompositeExpressionNode;
      }

      leftTokens.push(input[i]);
    }

    if (input[0].type === RsqlTokenType.ParenLeft && input[input.length - 1].type === RsqlTokenType.ParenRight) {
      return this.parseRecursive(input.slice(1, -1));
    }

    throw new TypeError(`RSQL parsing error`);
  }
}
