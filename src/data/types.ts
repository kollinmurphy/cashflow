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
    loans: number;
    children: number;
    leftRatRace: boolean;
    postRatRace: {
      startingIncome: number;
      cash: number;
      assets: Asset[];
      won: boolean;
    };
  };
  history: any[];
};

export type Asset = RealEstateAsset | StockAsset | OtherAsset;

export interface GenericAsset {
  id: string;
  name: string;
  cashflow: number;
  cost: number;
}

export interface RealEstateAsset extends GenericAsset {
  type: "realEstate";
  mortgage: number;
  downPayment: number;
}

export interface StockAsset extends GenericAsset {
  type: "stock";
  stock: StockName;
  shares: number;
  avgPrice: number;
}

export interface OtherAsset extends GenericAsset {
  type: "other";
}

export enum StockName {
  ON2U = "ON2U",
  MYT4U = "MYT4U",
  OK4U = "OK4U",
  "2BIG" = "2BIG",
}

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
