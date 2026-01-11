export type Token<TokenType> = {
  type: TokenType;
  value: string;
};

export interface LineTokenizer<TokenType, StateType> {
  readonly initialState: StateType;

  tokenizeLine(
    line: string,
    state: StateType,
  ): { tokens: Token<TokenType>[]; state: StateType };
}
