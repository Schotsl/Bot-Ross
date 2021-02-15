export interface Expense {
  amount: number;
  contacts: Array<string>;
  insertion: number;
  description: string;
}

export interface Dictionary {
  [key: string]: number;
}
