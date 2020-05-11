export enum RsqlTokenType {
  CompositeAndOperator = 'COMPOSITE_AND_OPERATOR',
  CompositeOrOperator = 'COMPOSITE_OR_OPERATOR',

  BasicEqualOperator = 'BASIC_EQUAL_OPERATOR',
  BasicNotEqualOperator = 'BASIC_NOT_EQUAL_OPERATOR',
  BasicGreaterOperator = 'BASIC_GREATER_OPERATOR',
  BasicGreaterOrEqualOperator = 'BASIC_GREATER_OR_EQUAL_OPERATOR',
  BasicLessOperator = 'BASIC_LESS_OPERATOR',
  BasicLessOrEqualOperator = 'BASIC_LESS_OR_EQUAL_OPERATOR',
  BasicInOperator = 'BASIC_IN_OPERATOR',
  BasicNotInOperator = 'BASIC_NOT_IN_OPERATOR',
  BasicIncludesAllOperator = 'BASIC_INCLUDES_ALL_OPERATOR',
  BasicIncludesOneOperator = 'BASIC_INCLUDES_ONE_OPERATOR',

  ParenLeft = 'PAREN_LEFT',
  ParenRight = 'PAREN_RIGHT',

  Field = 'FIELD',
  Value = 'VALUE',
  ValueList = 'VALUE_LIST',
}
