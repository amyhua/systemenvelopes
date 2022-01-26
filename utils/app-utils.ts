export function classNames(...classes: String[]): string {
  return classes.filter(Boolean).join(' ')
}

