import { RsqlTokenType } from '../../rsql-tokenizer/entities/rsql-token-type';
import { RsqlAstNodeType } from './rsql-ast-node-type';

export type RsqlAstNode =
  | RsqlAstRootNode
  | RsqlAstCompositeExpressionNode
  | RsqlAstBasicExpressionNode
  | RsqlAstBasicListExpressionNode;

export interface RsqlAstRootNode {
  type: RsqlAstNodeType.Root;
  value:
    | RsqlAstCompositeExpressionNode
    | RsqlAstBasicExpressionNode
    | RsqlAstBasicListExpressionNode;
}

export interface RsqlAstCompositeExpressionNode {
  type: RsqlAstNodeType.CompositeExpression;
  operator: RsqlTokenType.CompositeAndOperator | RsqlTokenType.CompositeOrOperator;
  value: Array<
    RsqlAstCompositeExpressionNode | RsqlAstBasicExpressionNode | RsqlAstBasicListExpressionNode
  >;
}

export interface RsqlAstBasicExpressionNode {
  type: RsqlAstNodeType.BasicExpression;
  operator:
    | RsqlTokenType.BasicEqualOperator
    | RsqlTokenType.BasicNotEqualOperator
    | RsqlTokenType.BasicGreaterOperator
    | RsqlTokenType.BasicGreaterOrEqualOperator
    | RsqlTokenType.BasicLessOperator
    | RsqlTokenType.BasicLessOrEqualOperator;
  field: string;
  value: string;
}

export interface RsqlAstBasicListExpressionNode {
  type: RsqlAstNodeType.BasicExpression;
  operator:
    | RsqlTokenType.BasicInOperator
    | RsqlTokenType.BasicNotInOperator
    | RsqlTokenType.BasicIncludesAllOperator
    | RsqlTokenType.BasicIncludesOneOperator;
  field: string;
  value: string[];
}
