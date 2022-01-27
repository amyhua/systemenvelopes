import { useState, State } from '@hookstate/core';
import { MailIcon, MailOpenIcon, PencilIcon } from '@heroicons/react/outline'
import { ChartBarIcon } from '@heroicons/react/solid'
import { classNames } from '../utils/app-utils';
import { updateBudgetItem } from '../utils/fetch-utils'
import { EnvelopePeriod, ActivePeriodType } from '../types';
import LogSpendForm from './LogSpendForm';
import ProgressBar from './ProgressBar';

const EnvelopeItem = ({
  id,
  name,
  targetSpend=0,
  period=EnvelopePeriod.Month,
  thisPeriodSpent=0,
  lastPeriodSpent=0,
}: {
  id: number | string,
  name: string,
  targetSpend: number,
  period: EnvelopePeriod,
  thisPeriodSpent: number,
  lastPeriodSpent: number,
}) => {
  const startLog: State = useState(false);
  const loggedSpendBlur: State = useState(false);
  const thisPeriodSpentState: State = useState(thisPeriodSpent)
  const lastPeriodSpentState: State = useState(lastPeriodSpent)
  const periodType: State = useState(ActivePeriodType.This)
  const spentActivePeriod = periodType.get() === ActivePeriodType.This ? thisPeriodSpentState.get() : lastPeriodSpentState.get()
  const spentHealthTextColorClassName = spentActivePeriod !== undefined &&
  targetSpend < spentActivePeriod ?
  'text-red-500' : 'text-green-500';
  const periodPronoun = periodType.get() === ActivePeriodType.This ? 'this' : 'last'
  const onLogSpendFormSubmit = (totalSpent:number, periodType: ActivePeriodType): void => {
    updateBudgetItem(id, {
      [periodType === ActivePeriodType.This ? 'spent_this_period' : 'spent_last_period']: totalSpent
    })
    .then((r: any) => r.json())
    .then(budgetItem => {
      if (periodType === ActivePeriodType.This) {
        thisPeriodSpentState.set(budgetItem.spent_this_period)
      } else {
        lastPeriodSpentState.set(budgetItem.spent_last_period)
      }
    })
  }
  const onLogSpendFormCancel = () => {
    console.log('cancel')
    startLog.set(false)
  }
  if (loggedSpendBlur.get()) {
    setTimeout(() => {
      loggedSpendBlur.set(false)
    }, 500)
  }
  return (
    <div className={`bg-white py-5 border-b border-gray-200 sm:px-2`}>
      <div className={`}
        ${startLog.get() ? 'cursor-auto' : 'cursor-pointer'}
        -ml-4 flex justify-between items-center
        flex-wrap sm:flex-nowrap`}
      onClick={() => startLog.set(true)}>
        <div className="ml-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {
              startLog.get() ?
              <MailOpenIcon className={`mr-1 h-5 w-5 inline align-top mt-0.5 ${spentHealthTextColorClassName}`} /> :
              <MailIcon className={`mr-1 h-5 w-5 inline align-top mt-0.5 ${spentHealthTextColorClassName}`} />
            }
            {' '}
            {name}
          </h3>
          <div className="mt-1 ml-5 text-sm text-gray-400">
            {
              spentActivePeriod !== undefined ?
              <>
                <div className={classNames(
                  'ml-2',
                  'md:mt-0 mt-1 align-bottom inline-block'
                )}>
                  <ProgressBar target={targetSpend} spent={spentActivePeriod} />
                  <span className={classNames(
                    `font-semibold transition`,
                    spentHealthTextColorClassName,
                    loggedSpendBlur.get() ? `bg-yellow-50` : `bg-white`,
                  )}>${Math.abs(targetSpend - spentActivePeriod).toFixed(2).toLocaleString()}
                  </span>
                  <span className="font-normal">
                    {
                      targetSpend < spentActivePeriod ? ' over' : ' left'
                    }
                  </span>{' '}
                  
                </div>
              </> :
              <span className="ml-2">
                <em>Nothing logged {periodPronoun} {period}</em>
              </span>
            }
          </div>
        </div>
        <div className="md:ml-4 ml-11 mt-2 md:mt-0 text-xl flex-shrink-0 text-right">
          {
            spentActivePeriod !== undefined ?
            <>
            <span className={classNames(
              'font-normal',
              'text-gray-400',
              loggedSpendBlur.get() ? `bg-yellow-50` : `bg-white`,
            )}>
              ${(spentActivePeriod || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
            </span><span className="text-gray-400">/</span>
            </>
            : null
          }
          <span className="mr-2 font-semibold text-right">
            ${targetSpend.toFixed(0).toLocaleString()}
          </span>
          <button
            type="button" style={{marginTop: 3}}
            className="ml-2 relative inline-flex items-center
              px-2 align-top mt-0
              font-light
              text-gray-400 hover:text-gray-800
              "
          >
            <ChartBarIcon className="h-5 h-5" />
          </button>
          <button
            type="button" style={{marginTop: 3}}
            className="ml-2 relative inline-flex items-center
              px-2 align-top mt-0
              font-medium
              text-gray-400 hover:text-gray-800
              "
          >
            <PencilIcon className="h-5 h-5" />
          </button>
        </div>
      </div>
      {
        startLog.get() &&
        <LogSpendForm
          onSubmit={onLogSpendFormSubmit}
          onCancelForm={onLogSpendFormCancel}
          period={period}
          targetSpend={targetSpend}
          thisPeriodSpent={thisPeriodSpentState.get()}
          lastPeriodSpent={lastPeriodSpentState.get()}
        />
      }
    </div>
  )
}
/*
FEATURES/
search what you bought by hashtags, source
- a sense of where I'm spending my money more
- ability to search by hashtag of all the transactions i made
    for a particular category
    people don't wanna put stuff in different fields
    e.g. pans, #amazon. can search by hashtag for those txns
  - analyze their data via hashtags
  - date: should be separate field
      - set to today by default, but changeable
  - stacked bar chart of
      expected (envelope targets) vs actual
  - people struggle with analyzing their own data
- transport transaction data via spreadsheet
    - export spend items
    - import spend items
- if they underspent in a category
  have them move it to a savings/extras account
    "you saved $X this month by underspending in Groceries, xxx, xxx last month"
    and you can leave it in "savings" pot
      which you can "withdraw" from if you exceed it
      and have a "savings pot" which will incentivize people to save
LTR
  - some calculators, for how much they need to save for different things
    - e.g., if you want to buy a car, a house, a down payment
    - how many years, months, dates
    - goal setting for people
    - give them goals
*/

export default EnvelopeItem
