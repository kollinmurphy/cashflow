export type Sheet = {
  id: string;
  userId: string;
  profession: Profession;
  closed: boolean;
};

export type Profession = {
  name: string;
  income: {
    salary: number;
  };
  expenses: {
    taxes: number;
    mortgage: number;
    school: number;
    car: number;
    creditCards: number;
    retail: number;
    other: number;
    perChild: number;
  };
  assets: {
    savings: number;
  };
  liabilities: {
    mortgage: number;
    school: number;
    car: number;
    creditCards: number;
    retail: number;
  };
};
