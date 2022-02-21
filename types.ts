export interface EnvelopeItemDatum {
  name: string;
  priority?: number
}

export enum EnvelopePeriod {
  Month = 'month',
  Week = 'week',
  Year = 'year'
}

export enum ActivePeriodType {
  This = 'this',
  Last = 'last'
}

export interface BudgetEnvelope {
  id: string;
  userId: number;
  budgetId: number;
  name: string;
  targetSpend: number;
  period: EnvelopePeriod;
  thisPeriodSpent: number;
  lastPeriodSpent: number;
}

export interface BudgetTotal {
  spentLastPeriod: number;
  spentThisPeriod: number;
  period: EnvelopePeriod;
  targetSum: number;
}

export interface BudgetChange {
  amount: number,
  amountSign: number,
  periodType: ActivePeriodType
}