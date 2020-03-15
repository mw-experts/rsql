import { RsqlTokenType } from '../../rsql-tokenizer/rsql-token-type';

export interface BasicExpressionNode {
  type: 'BasicExpression';
  name: RsqlTokenType.BasicOperator;
  params: {
    field: string;
    value: string;
  };
}
