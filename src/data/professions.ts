import type { Profession } from "./types";

export const professions: Profession[] = [
  {
    name: "Janitor",
    income: {
      salary: 1600,
    },
    expenses: {
      taxes: 280,
      mortgage: 200,
      school: 0,
      car: 60,
      creditCards: 60,
      retail: 50,
      other: 300,
      perChild: 70,
    },
    assets: {
      savings: 560,
    },
    liabilities: {
      mortgage: 20000,
      school: 0,
      car: 4000,
      creditCards: 2000,
      retail: 1000,
    },
  },
  {
    name: "Lawyer",
    income: {
      salary: 7500,
    },
    expenses: {
      taxes: 1830,
      mortgage: 1100,
      school: 390,
      car: 220,
      creditCards: 180,
      retail: 50,
      other: 1650,
      perChild: 380,
    },
    assets: {
      savings: 400,
    },
    liabilities: {
      mortgage: 115_000,
      school: 78_000,
      car: 11_000,
      creditCards: 6_000,
      retail: 1_000,
    },
  },
  {
    name: "Police Officer",
    income: {
      salary: 3000,
    },
    expenses: {
      taxes: 580,
      mortgage: 400,
      school: 0,
      car: 100,
      creditCards: 60,
      retail: 50,
      other: 690,
      perChild: 160,
    },
    assets: {
      savings: 520,
    },
    liabilities: {
      mortgage: 46_000,
      school: 0,
      car: 5_000,
      creditCards: 2_000,
      retail: 1_000,
    },
  },
  {
    name: "Secretary",
    income: {
      salary: 2500,
    },
    expenses: {
      taxes: 460,
      mortgage: 400,
      school: 0,
      car: 80,
      creditCards: 60,
      retail: 50,
      other: 570,
      perChild: 140,
    },
    assets: {
      savings: 710,
    },
    liabilities: {
      mortgage: 38_000,
      school: 0,
      car: 4_000,
      creditCards: 2_000,
      retail: 1_000,
    },
  }
];
