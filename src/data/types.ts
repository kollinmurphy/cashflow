export type Sheet = {
  id: string;
  userId: string;
  profession: Profession;
  closed: boolean;
  current: {
    cash: number;
    expenses: Expenses;
    assets: Asset[];
    stocks: Record<StockName, StockAsset>;
    liabilities: Liabilities;
    boat: boolean;
  };
  history: any[];
};

export type Asset = {
  id: string;
  name: string;
  amount: number;
};

export enum StockName {
  ON2U = "ON2U",
  MYT4U = "MYT4U",
  OK4U = "OK4U",
}

export type StockAsset = {
  name: StockName;
  shares: number;
  avgPrice: number;
};

export interface Expenses extends Liabilities {
  taxes: number;
  other: number;
}

export interface Liabilities {
  mortgage: number;
  school: number;
  car: number;
  creditCards: number;
  retail: number;
}

export type Profession = {
  name: string;
  perChild: number;
  income: {
    salary: number;
  };
  expenses: Expenses;
  assets: {
    savings: number;
  };
  liabilities: Liabilities;
};
