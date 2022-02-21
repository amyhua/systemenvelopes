import { useState, State } from '@hookstate/core';
import { MailIcon, MailOpenIcon, PencilIcon } from '@heroicons/react/outline'
import { ChartBarIcon } from '@heroicons/react/solid'
import { classNames, getSpentHealthTextColorClassName } from '../utils/app-utils';
import { updateBudgetItem } from '../utils/fetch-utils'
import { EnvelopePeriod, ActivePeriodType, BudgetChange, BudgetEnvelope } from '../types';
import LogSpendForm from './LogSpendForm';
import ProgressBar from './ProgressBar';
import styles from './EnvelopeItem.module.css';
import { Dialog } from '@headlessui/react';
import EnvelopeItemEditForm from './EnvelopeItemEditForm';

const getPeriodSpentFieldName = (periodType: ActivePeriodType) => {
  switch (periodType) {
    case ActivePeriodType.This:
      return 'thisPeriodSpent'
    case ActivePeriodType.Last:
      return 'lastPeriodSpent'
    default:
      return 'UNRESOLVED_PERIOD_SPENT_FIELD_NAME for ' + periodType.toString()
  }
}

const EnvelopeItem = ({
  id,
  name,
  targetSpend=0,
  period=EnvelopePeriod.Month,
  thisPeriodSpent=0,
  lastPeriodSpent=0,

  onChange,
  daysLeft,
  periodType,
}: {
  budgetItem: BudgetEnvelope,
  periodType: ActivePeriodType,
  onChange: (change: BudgetChange) => void,
  daysLeft: number,
}) => {
  const startLog: State = useState(false)
  const isEditModalOpen: State = useState(false)
  const loggedSpendBlur: State = useState(false)
  const periodPronoun = periodType === ActivePeriodType.This ? 'this' : 'last'
  const thisPeriodSpentState: State = useState(thisPeriodSpent)
  const lastPeriodSpentState: State = useState(lastPeriodSpent)
  const spentActivePeriod = periodType === ActivePeriodType.This ? thisPeriodSpentState.get() : lastPeriodSpentState.get()
  const spentHealthTextColorClassName = getSpentHealthTextColorClassName(spentActivePeriod, targetSpend)
  
  const onEnvelopeSubmit = (spent: number, target: number, periodType: ActivePeriodType, amount: number, amountSign: number): Promise<any> => {
    const budgetItemChange = {
      [getPeriodSpentFieldName(periodType)]: spent,
      target,
    }
    return updateBudgetItem(id, budgetItemChange)
    .then((r: any) => r.json())
    .then(budgetItem => {
      budgetItemState.set(budgetItem)
      if (periodType === ActivePeriodType.This) {
        thisPeriodSpentState.set(budgetItem.thisPeriodSpent)
      } else {
        lastPeriodSpentState.set(budgetItem.lastPeriodSpent)
      }
      onChange({ amount, amountSign, periodType })
    })
  }
  const onLogSpendFormCancel = () => {
    startLog.set(false)
  }
  if (loggedSpendBlur.get()) {
    setTimeout(() => {
      loggedSpendBlur.set(false)
    }, 500)
  }
  return (
    <div className={classNames(
      'bg-white my-5 pb-5 border-b border-gray-200 sm:px-2',
      styles.container
    )}>
      <Dialog open={isEditModalOpen.get()} onClose={() => isEditModalOpen.set((prop: boolean) => false)}>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <Dialog.Title>Edit Envelope <em className="italic">{name}</em></Dialog.Title>
        <Dialog.Description>
          <EnvelopeItemEditForm
            name={name}
            targetSpend={targetSpend}
          />
        </Dialog.Description>
      </Dialog>
      <div className={`
        cursor-pointer 
        -ml-4 flex justify-between items-center
        flex-wrap sm:flex-nowrap`}
      onClick={() => startLog.set(!startLog.get())}>
        <div className="ml-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {
              startLog.get() ?
              <MailOpenIcon className={`mr-1 h-6 w-6 inline align-top mt-0.25`} /> :
              <MailIcon className={`mr-1 h-6 w-6 inline align-top mt-0.25`} />
            }
            {' '}
            {name}
          </h3>
          <div className="mt-1 ml-5 text-sm text-gray-400">
            {
              spentActivePeriod !== undefined ?
              <>
                <div className={classNames(
                  'ml-3',
                  'md:mt-0 mt-1 align-bottom inline-block'
                )}>
                  <span className={classNames(
                    `font-semibold text-base transition`,
                    spentHealthTextColorClassName,
                    loggedSpendBlur.get() ? `bg-yellow-50` : `bg-white`,
                  )}>${(targetSpend - spentActivePeriod).toDollarFormat()}
                  </span>{' '}
                  <span className="inline-block text-base mr-2">
                    available
                  </span>
                </div>
              </> :
              <span className="ml-2">
                <em>Nothing logged {periodPronoun} {period}</em>
              </span>
            }
          </div>
        </div>
        <div className="md:ml-4 ml-11 mt-2 md:mt-0 text-xl flex-shrink-0 text-right">
          <div className="flex">
            <div>
              <span>
                {
                  spentActivePeriod !== undefined ?
                  <>
                  <span className={classNames(
                    'font-normal',
                    'text-gray-400',
                    loggedSpendBlur.get() ? `bg-yellow-50` : `bg-white`,
                  )}>
                    ${(spentActivePeriod || 0).toFixed(0)}
                  </span><span className="text-gray-400">/</span>
                  </>
                  : null
                }
                <span className="font-semibold text-right">
                  ${targetSpend.toFixed(0)}
                </span>
              </span>
              <span className="block h-2 mt-2">
                <ProgressBar top={0} width={100} target={targetSpend} spent={spentActivePeriod} />
              </span>
            </div>
            <div>
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
                  cursor-pointer
                  font-medium
                  text-gray-400 hover:text-gray-800
                  "
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  isEditModalOpen.set(true)
                }}
              >
                <PencilIcon className="h-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {
        startLog.get() &&
        <>
          <LogSpendForm
            name={name}
            onEnvelopeSubmit={onEnvelopeSubmit}
            onCancelForm={onLogSpendFormCancel}
            period={period}
            uncategorized={false}
            targetSpend={targetSpend}
            thisPeriodSpent={thisPeriodSpentState.get()}
            lastPeriodSpent={lastPeriodSpentState.get()}
          />
        </>
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
