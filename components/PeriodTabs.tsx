import { useState, State } from '@hookstate/core';
import { classNames } from '../utils/app-utils'
import { Tab } from '@headlessui/react'
import { ActivePeriodType, EnvelopePeriod } from "../types"

const toPeriodLabel = (period: EnvelopePeriod): string => {
  switch (period) {
    case EnvelopePeriod.Week:
      return 'week'
    case EnvelopePeriod.Month:
      return 'month'
    case EnvelopePeriod.Year:
      return 'year'
    default:
      return 'UNDEFINED PERIOD LABEL ERROR'
  }
}

const periodLoggedLabel = (period: EnvelopePeriod) => ({
  [ActivePeriodType.This]: `This ${toPeriodLabel(period)}`,
  [ActivePeriodType.Last]: `Last ${toPeriodLabel(period)}`,
});

const PeriodTabs = ({
  activePeriodTypeVal,
  period
}: {
  activePeriodTypeVal: ActivePeriodType,
  period: EnvelopePeriod
}) => {
  const activePeriodType: State = useState(activePeriodTypeVal)
  return (
    <span className="whitespace-nowrap md:mt-0 mt-1 inline-block">
      <span className="inline-block w-24 ml-0 pl-3" style={{width: 258, marginLeft: 4, paddingRight: 4}}>
        <Tab.Group onChange={(index: number) => {
          const periodType = Object.keys(periodLoggedLabel(period))[index]
          activePeriodType.set(periodType as ActivePeriodType)
        }}>
          <Tab.List className="flex p-1 bg-gray-800 rounded-xl">
            {Object.keys(periodLoggedLabel(period)).map((periodType: string) => (
              <Tab
                key={periodType}
                className={({ selected }) =>
                  classNames(
                    'w-full py-2 text-sm leading-5 font-medium text-black rounded-lg',
                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-700 ring-white ring-opacity-60',
                    selected
                      ? 'bg-white shadow'
                      : 'text-white hover:bg-white/[0.12] hover:text-white'
                  )
                }
            >
              {periodLoggedLabel(period)[periodType as ActivePeriodType]}
            </Tab>
          ))}
        </Tab.List>
        </Tab.Group>
      </span>
    </span>
  )
}

export default PeriodTabs
