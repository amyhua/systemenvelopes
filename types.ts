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
