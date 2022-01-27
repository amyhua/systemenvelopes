import { classNames } from '../utils/app-utils'
import { Tab } from '@headlessui/react'
import { useState, State } from '@hookstate/core'
import { EnvelopePeriod, ActivePeriodType } from "../types"
import { ArrowDownIcon, ArrowUpIcon, PlusCircleIcon, MinusCircleIcon, AnnotationIcon, HashtagIcon } from '@heroicons/react/outline'
import styles from './EnvelopeItem.module.css'

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

const LogSpendForm = ({ onSubmit, period, onCancelForm, targetSpend, thisPeriodSpent, lastPeriodSpent }: {
  onSubmit: (amount: number, periodType: ActivePeriodType) => void,
  period: EnvelopePeriod,
  onCancelForm: () => void,
  targetSpend: number,
  thisPeriodSpent: number,
  lastPeriodSpent: number,
}) => {
  const amountState: State = useState(0)
  const amountOnFocus: State = useState(false)
  const amountChangeBlur: State = useState(false)
  const cancelling: State = useState(false)
  const activePeriodType: State = useState(ActivePeriodType.This)
  const hashtagValue: State = useState('')
  const hashtags: State = useState([])
  const activePeriodSpent: number = activePeriodType.get() === ActivePeriodType.This ?
    thisPeriodSpent : lastPeriodSpent
  const WillRemainText = () => amountState.get() === 0 ? null :
    <span className="ml-1 text-slate-300 font-light">
      <strong className="font-semibold">${(targetSpend - (activePeriodSpent + amountState.get())).toDollarFormat()}</strong> will be left
    </span>;
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
  const addHashtag = (val: string) => hashtags.merge(val)
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
        onSubmit(amountState.get() + activePeriodSpent, activePeriodType.get())
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
                      Number(amountState.get().toFixed(2)).toDollarFormat()
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
          <div className="mt-5 md:mt-2 ml-4 text-sm">
            <div className="md:grid grid-cols-1" style={{maxWidth: 488}}>
              <div className="mt-1 mb-1">
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AnnotationIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    className="
                    block
                    border border-gray-300 bg-white
                    pl-9 pr-2 py-2
                    focus:ring-gray-300
                    focus:border-gray-300
                    block w-full sm:text-sm
                    border-gray-800 rounded-md"
                    placeholder="Description"
                  />
                </div>
              </div>
              <div className="mt-1">
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HashtagIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="
                    absolute
                    right-0 pl-3
                    flex items-center">
                    <button
                      type="submit"
                      className="rounded-md text-sm
                        text-gray-400 bg-gray-800 text-white"
                      aria-hidden="true" style={{
                        padding: '9px 14px', marginTop: 0,
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0
                      }}
                      onClick={() => {
                        if (hashtagValue.get().length) {
                          addHashtag(hashtagValue.get())
                        }
                      }}
                    >Add</button>
                  </div>
                  <input
                    type="text"
                    name="hashtags"
                    id="hashtags"
                    className="
                    block
                    border border-gray-800 bg-white
                    pl-9 pr-2 py-2
                    focus:ring-gray-300
                    focus:border-gray-300
                    block w-full sm:text-sm
                    border-gray-300 rounded-md"
                    placeholder="Hashtag(s)"
                    onChange={e => hashtagValue.set(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && hashtagValue.get().length) {
                        addHashtag(hashtagValue.get())
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 ml-4" style={{maxWidth: 488}}>
            <button type="submit"
              style={{marginTop: 2}}
              onClick={() => {
                onSubmit(amountState.get() + activePeriodSpent, activePeriodType.get())
                onCancelHandler()
              }}
              className={classNames(
                'block rounded-lg',
                'w-full py-2.5 text-sm leading-5 font-medium text-black',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-800 ring-white ring-opacity-60',
                'bg-gray-800 hover:bg-gray-700 ease-in text-white px-3'
              )}>
                {
                  amountState.get() >= 0 ? <span>
                    <ArrowDownIcon className="h-4 w-5 inline-block mr-1 align-top mt-1" /> <span className="text-base">
                      Withdraw <WillRemainText />
                    </span>
                  </span> : <span>
                    <ArrowUpIcon className="h-4 w-5 inline-block mr-1 align-top mt-1" /> <span className="text-base">
                      Deposit <WillRemainText />
                    </span>
                  </span>
                }
            </button>
          </div>
          <div className="mt-4 ml-5 text-sm">
            <a href="#"
            onClick={onCancelHandler}
            className="underline text-gray-500 hover:text-gray-800">Close</a>
          </div>
        </div>
      </form>
    </div>
  )
}

export default LogSpendForm
