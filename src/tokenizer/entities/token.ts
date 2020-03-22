export interface Token<Type> {
  type: Type;
  value: string | string[];
  origin: string;
  charsBack: number;
}
