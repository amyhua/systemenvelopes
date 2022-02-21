import { EnvelopePeriod, ActivePeriodType } from "../types";
import { classNames } from "../utils/app-utils";

export default ({
  period,
  active,
  periodType,
  onClick,
}: {
  period: EnvelopePeriod;
  active?: boolean;
  periodType: ActivePeriodType;
  onClick: () => void;
}) => {
  return (
    <button type="button"
      onClick={onClick}
      className={classNames(
        active ? 'bg-blue-500 text-white' : 'bg-slate-50',
        'rounded-md text-gray-700',
        'font-medium hover:bg-blue-600 hover:text-white mr-3 px-3 py-2'
      )}>
      {
        periodType === ActivePeriodType.This ? 'this' :
        periodType === ActivePeriodType.Last ? 'last' :
        'UNRESOLVED_PERIOD_TYPE'
      } {period}
    </button>
  )
}