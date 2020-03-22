export interface Token<Type> {
  type: Type;
  value: string;
  origin: string;
  charsBack: number;
}
