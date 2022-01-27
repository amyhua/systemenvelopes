interface Number {
  toDollarFormat: () => string;
}

export function initAppUtils() {
  function formatDollarsString(this: any) {
    return this.toLocaleString(undefined, {minimumFractionDigits: 2})
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
