import { Tab } from '@headlessui/react'
import { useState, State } from '@hookstate/core';
import { MailIcon, MailOpenIcon, PencilIcon, PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/outline'
import { ChartBarIcon, PlusIcon, CurrencyDollarIcon } from '@heroicons/react/solid'
import LogSpendButton from './LogSpendButton';
import { classNames } from '../utils/app-utils';
import styles from './EnvelopeItem.module.css';

interface EnvelopeItemDatum {
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

const EnvelopeProgressBar = ({
  targetSpend,
  spentActivePeriod
}: {
  targetSpend: number,
  spentActivePeriod: number
}) => {
  const percent100 = Math.round((spentActivePeriod/targetSpend) * 100);
  return (
    <div className="inline-block align-top
      mt-2
      mr-2 bg-green-500 rounded-full" style={{width: 100}}>
      <div
        className={`bg-slate-500 text-xs opacity-0.6 font-medium text-slate-300 text-center p-0.25 leading-none rounded-l-full`}
        style={{
          width: percent100,
          height: 5,
        }}></div>
    </div>
  )
}

const EnvelopeItem = ({
  name,
  targetSpend=0,
  period=EnvelopePeriod.Month,
  thisPeriodSpent=0,
  lastPeriodSpent=0,
}: {
  name: string,
  targetSpend: number,
  period: EnvelopePeriod,
  thisPeriodSpent: number,
  lastPeriodSpent: number,
}) => {
  const startLog: State = useState(false);
  const loggedSpendBlur: State = useState(false);
  const periodType: State = useState(ActivePeriodType.This)
  const spentActivePeriod = periodType.get() === ActivePeriodType.This ? thisPeriodSpent : lastPeriodSpent
  const spentHealthTextColorClassName = spentActivePeriod !== undefined &&
  targetSpend < spentActivePeriod ?
  'text-red-500' : 'text-green-500';
  const periodPronoun = periodType.get() === ActivePeriodType.This ? 'this' : 'last'
  const onLogSpendFormSubmit = (amount:number, periodType: ActivePeriodType): void => {
    console.log('onLogSpendFormSubmit', amount, periodType)
    loggedSpendBlur.set(true)
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
                  <EnvelopeProgressBar targetSpend={targetSpend} spentActivePeriod={spentActivePeriod} />
                  <span className={classNames(
                    `font-semibold transition`,
                    spentHealthTextColorClassName,
                    loggedSpendBlur.get() ? `bg-yellow-50` : `bg-white`,
                  )}>${Math.abs(targetSpend - spentActivePeriod).toFixed(2).toLocaleString()}
                  <span className="font-normal">
                    {
                      targetSpend < spentActivePeriod ? ' over' : ' left'
                    }
                  </span></span> {periodPronoun} {period}
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
        />
      }
    </div>
  )
}

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

const LogSpendForm = ({ onSubmit, period, onCancelForm }: {
  onSubmit: (amount: number, periodType: ActivePeriodType) => void,
  period: EnvelopePeriod,
  onCancelForm: () => void
}) => {
  const amountState: State = useState(0)
  const amountOnFocus: State = useState(false)
  const amountChangeBlur: State = useState(false)
  const cancelling: State = useState(false)
  const activePeriodType: State = useState(ActivePeriodType.This)
  const amountDeltaOnClickFn = (delta: number) => () => {
    amountState.set(amountState.get() + delta)
    amountChangeBlur.set(true)
  }
  const onCancelHandler = () => {
    cancelling.set(true)
    setTimeout(() => {
      onCancelForm()
    }, 500)
  }
  if (amountChangeBlur.get()) {
    setTimeout(() => amountChangeBlur.set(false), 75);
  }
  return (
    <div className={`${styles.logSpendForm} spend-form ml-3 mb-5 h-auto ${
      cancelling.get() ? styles.cancelling : ''
    }`} style={{
      overflow: 'hidden',
      transition: 'height 0.3s ease-in-out, margin-top 0.3s ease-in-out, margin-bottom 0.3s ease-in-out'
    }}>
      <form onSubmit={(e) => {
        e.preventDefault()
        onSubmit(amountState.get(), activePeriodType.get())
        onCancelHandler()
      }}>
        <div className="mb-1 mt-5">
          <span className="inline-block align-middle mb-2">
            <button
              type="button"
              className="ml-3 relative inline-flex items-center
                align-top mt-1
                font-medium
                text-gray-700 hover:text-green-500
                "
            >
              <MinusCircleIcon
                onClick={() => {
                  amountState.set(amountState.get() - 1)
                  amountChangeBlur.set(true)
                }}
                className="h-10 w-10" /> 
            </button>
            {
              amountOnFocus.get() ?
              <input
                style={{width: 150}}
                className="text-4xl mt-1 text-gray-700 text-center inline-block"
                type="number"
                value={amountState.get() === 0 ? '' : amountState.get()}
                autoFocus={true}
                onChange={e => amountState.set(Number(e.target.value))}
                onFocus={() => amountOnFocus.set(true)}
                onBlur={() => amountOnFocus.set(false)}
              /> :
              <span
                style={{width: 150}}
                onClick={() => amountOnFocus.set(true)}
                className={`text-center inline-block text-gray-700 ${
                  amountState.get() > 999 ? 'mt-2 text-2xl' : 'mt-1 text-4xl'
                }`}>
                  <span className={`
                    ${amountChangeBlur.get() ? (
                      amountState.get() < 0 ? 'text-green-500' : 'text-red-500'
                    ) : 
                      'text-gray-700'
                    } 
                    ease-in-out
                  `}>
                    ${
                      Number(amountState.get().toFixed(2)).toLocaleString(undefined, {minimumFractionDigits: 2})
                    }
                  </span>
              </span>
            }
            <button
              type="button"
              className="relative inline-flex items-center
                mr-1 align-top mt-1
                font-medium
                text-gray-700 hover:text-red-500
                "
            >
              <PlusCircleIcon
                onClick={() => {
                  amountState.set(amountState.get() + 1)
                  amountChangeBlur.set(true)
                }}
                className="h-10 w-10" /> 
            </button>
          </span>
          <span className="whitespace-nowrap md:mt-0 mt-1 inline-block">
            <button type="submit"
              style={{marginTop: 2, width: 150}}
              onClick={() => {
                onSubmit(amountState.get(), activePeriodType.get())
                onCancelHandler()
              }}
              className={classNames(
                'inline-block',
                'w-full py-2.5 mr-2 md:ml-5 ml-4 mr-4 text-sm leading-5 font-medium text-black rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-800 ring-white ring-opacity-60',
                'bg-gray-800 hover:bg-gray-700 ease-in text-white px-3'
              )}>
                {
                  amountState.get() < 0 ?
                  'Deposit' : 'Withdraw'
                }
            </button>
            <span className="inline-block md:ml-0 ml-6" style={{width: 225}}>
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
        </div>
        <div className="flex-shrink-0">
          <div className="mt-4" style={{marginLeft: 16}}>
            <span className="relative z-0 bg-gray-700 text-white inline-flex shadow-sm rounded-md">
              <button
                type="button"
                onClick={amountDeltaOnClickFn(5)}
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50
                  focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                +$5
              </button>
              <button
                type="button"
                onClick={amountDeltaOnClickFn(10)}
                className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                +$10
              </button>
              <button
                type="button"
                onClick={amountDeltaOnClickFn(50)}
                className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                +$50
              </button>
              <button
                type="button"
                onClick={amountDeltaOnClickFn(100)}
                className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                +$100
              </button>
              <button
                type="button"
                onClick={amountDeltaOnClickFn(500)}
                className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                +$500
              </button>
              <button
                type="button"
                onClick={amountDeltaOnClickFn(1000)}
                className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                +$1K
              </button>
              <button
                type="button"
                onClick={amountDeltaOnClickFn(amountState.get() * -1)}
                className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              >
                Reset
              </button>
            </span>
          </div>
          <div className="mt-4 ml-5 text-sm">
            <a href="#"
            onClick={onCancelHandler}
            className="underline text-gray-500 hover:text-gray-800">Cancel</a>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EnvelopeItem
