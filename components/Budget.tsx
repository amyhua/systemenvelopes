import { useState, State } from '@hookstate/core';
import { useEffect } from 'react'
import styles from './Budget.module.css'
import { MailOpenIcon, MailIcon, CurrencyDollarIcon, PlusIcon } from '@heroicons/react/solid'
import { CalendarIcon } from '@heroicons/react/outline'
import EnvelopeItem from './EnvelopeItem'
import ProgressBar from './ProgressBar';
import { getDaysInThisMonth, classNames, getSpentHealthTextColorClassName } from '../utils/app-utils';
import { ActivePeriodType, BudgetEnvelope, BudgetTotal, BudgetChange } from '../types';
import BudgetPeriodButton from './BudgetPeriodButton';
import LogSpendForm from './LogSpendForm';

const Budget = ({
  envelopes,
  budgetTotal
}: {
  envelopes: State,
  budgetTotal: State
}) => {
  const logFormIsOpen: State = useState(false)
  const activeBudgetPeriodType: State = useState(ActivePeriodType.This)
  const totalDaysThisPeriod = getDaysInThisMonth()
  const daysSpentThisPeriod = new Date().getDate()
  const daysLeftThisPeriod = totalDaysThisPeriod - daysSpentThisPeriod
  const onBudgetPeriodClick = (budgetPeriodType: ActivePeriodType) => () =>
    activeBudgetPeriodType.set(budgetPeriodType)
  
  if (envelopes.get().length == 0) return null;
  
  const onEnvelopeItemChange = ({amount, amountSign, periodType}: BudgetChange) => {
    console.log('onEnvelopeItemChange', amount, amountSign)
    if (amountSign === 1) {
      // deposit -> expand target, but keep spend accurate
      return budgetTotal.targetSum.set((prop: number) => prop + amount)
    }
    // withdrawal -> update spent
    switch (periodType) {
      case ActivePeriodType.This:
        budgetTotal.spentThisPeriod.set((prop: number) => prop + amount)
        break
      case ActivePeriodType.Last:
        budgetTotal.spentThisPeriod.set((prop: number) => prop + amount)
        break
      default:
        throw new Error (`UNHANDLED_PERIOD_TYPE ${periodType}`)
    }
  }

  return (
    <main className="p-5 bg-slate-200">
      <div className={classNames(
        styles.budget,
        'p-5 rounded-md shadow-md bg-white'
      )}>
        <header className="sm:flex text-lg text-gray-700 pb-2">
          <div className="sm:pb-0 pb-3">
            <div>
              <span className="inline-block mt-0.5 text-2xl">Monthly</span>
              <span className="ml-2 text-base align-top mt-1.5 inline-block text-slate-800">
                <CalendarIcon className="inline h-5 w-5 align-top mt-1" />
                <span className="align-middle ml-1">
                  {daysSpentThisPeriod}/{totalDaysThisPeriod} <span className="text-slate-400 font-normal">({daysLeftThisPeriod} days left)</span>
                </span>
              </span>
            </div>
            <div className="text-base mb-1">
              <span className={classNames(
                'font-bold',
                getSpentHealthTextColorClassName(budgetTotal.spentThisPeriod.get(), budgetTotal.targetSum.get())
              )}>
                ${(budgetTotal.targetSum.get() - budgetTotal.spentThisPeriod.get()).toDollarFormat()}
              </span> <span className="font-normal text-slate-500">
                available
              </span>
            </div>
          </div>
          <div className="sm:flex-1 flex-none block align-middle">
            <div className="sm:text-right mt-1">
              <span className="inline-block align-top">
                <div className="text-xl sm:text-right mt-2">
                  <span className="text-gray-400">${budgetTotal.spentThisPeriod.get().toDollarFormat()}/</span>
                  <span className="font-bold">${budgetTotal.targetSum.get().toDollarFormat()}</span>
                </div>
                <div className="text-right h-2 mb-2 mt-1">
                  {
                    budgetTotal.targetSum.get() &&
                    <ProgressBar
                      spent={budgetTotal.spentThisPeriod.get()}
                      target={budgetTotal.targetSum.get()}
                      top={5}
                      width={230}
                    />
                  }
                </div>
              </span>
            </div>
          </div>
        </header>
        <nav className="mt-3 pb-2 flex">
          <button type="button" style={{ marginTop: -5}}
            onClick={() => logFormIsOpen.set((p: boolean) => !p)}
            className="
            bg-red-500 text-white mr-3 hover:bg-red-600 py-1 px-3 rounded-md
            mt-2">
            <PlusIcon className="inline align-top mt-0.5 h-5 w-5" /> <CurrencyDollarIcon className="inline align-top mt-0.5 h-5 w-5" />
          </button>
          <button type="button" style={{ marginTop: -5}} className="
            bg-white text-slate-600 border-2 border-slate-600 hover:text-black py-1 px-3 rounded-md mt-2">
            <PlusIcon className="inline align-top mt-0.5 h-5 w-5" /> <MailIcon className="inline align-top mt-0.5 h-5 w-5" />
          </button>
          <div className="flex-1 text-right">
            <BudgetPeriodButton
              period={budgetTotal.period.get()}
              active={activeBudgetPeriodType.get() === ActivePeriodType.This}
              periodType={ActivePeriodType.This}
              onClick={onBudgetPeriodClick(ActivePeriodType.This)}
            />
            <BudgetPeriodButton
              period={budgetTotal.period.get()}
              active={activeBudgetPeriodType.get() === ActivePeriodType.Last}
              periodType={ActivePeriodType.Last}
              onClick={onBudgetPeriodClick(ActivePeriodType.Last)}
            />
          </div>
        </nav>
        {
          logFormIsOpen.get() ?
          <section>
            <LogSpendForm
              name={name}
              uncategorized={true}
              budgetEnvelopes={envelopes.get()}
              onCancelForm={() => logFormIsOpen.set(false)}
              period={budgetTotal.period.get()}
            />
          </section>
          : null
        }
        {
          envelopes.map((envelope: State, i: number) => {
            return <EnvelopeItem key={i}
              periodType={ActivePeriodType.This}
              {...envelope}
              onChange={onEnvelopeItemChange}
              daysLeft={daysLeftThisPeriod}
            />
          })
        }
      </div>
    </main>
  )
}

export default Budget
