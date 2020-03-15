import { RsqlTokenType } from '../../rsql-tokenizer/rsql-token-type';
import { BasicExpressionNode } from './basic-expression-node';

export interface CompositeExpressionNode {
  type: 'CompositeExpression';
  name: RsqlTokenType.CompositeOperator;
  params: Array<CompositeExpressionNode | BasicExpressionNode>;
}
