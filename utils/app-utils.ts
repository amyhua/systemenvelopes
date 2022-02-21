export function initAppUtils() {
  interface Number {
    toDollarFormat: () => string;
  }

  function formatDollarsString(this: any) {
    return this.toLocaleString(undefined, {minimumFractionDigits: 2})
      .replace('.00','')
  }
  Number.prototype.toDollarFormat = formatDollarsString
}
export function classNames(...classes: String[]): string {
  return classes.filter(Boolean).join(' ')
}

export function getDaysInThisMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
}

export const getSpentHealthTextColorClassName = (spent: number, target: number): string =>
  spent !== undefined &&
  target < spent ?
  'text-red-500' : 'text-green-500';