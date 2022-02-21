import { classNames, initAppUtils } from '../utils/app-utils'
import { Tab } from '@headlessui/react'
import { useState, State } from '@hookstate/core'
import { EnvelopePeriod, ActivePeriodType, BudgetEnvelope } from "../types"
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, MinusIcon, AnnotationIcon, HashtagIcon, XIcon, MailIcon } from '@heroicons/react/outline'
import styles from './LogSpendForm.module.css'
import { SwitchVerticalIcon } from '@heroicons/react/solid'

const EnvelopeTag = ({ children, isUncategorized, onClick }: {
  children: any,
  isUncategorized?: boolean,
  onClick: () => void
}) => (
  <span onClick={onClick} className="bg-slate-200
    cursor-pointer mr-2 hover:bg-slate-300
    rounded-md text-slate-700 px-2 py-2">
    {
      !isUncategorized &&
      <MailIcon className="inline h-4 w-4 mr-1 align-middle -mt-0.5" />
    }
    {children}
  </span>
)

const PickAmountDelta = ({ amountDeltaOnClickFn, amount, amountSign }: {
  amountDeltaOnClickFn: any,
  amount: number,
  amountSign: number,
}) => (
  <span className="relative z-0 bg-gray-700 text-white inline-flex shadow-sm rounded-md">
    <button
      type="button"
      onClick={amountDeltaOnClickFn(5)}
      className={classNames(
        `relative inline-flex
        md:inline-block hidden
        items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50
        focus:z-10 focus:outline-none focus:ring-1`,
        amountSign === 1 ?
        'focus:ring-green-500 focus:border-green-500':
        'focus:ring-red-500 focus:border-red-500',
      )}
    >
      +$5
    </button>
    <button
      type="button"
      onClick={amountDeltaOnClickFn(10)}
      className={classNames(
        `-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1`,
        amountSign === 1 ?
        'focus:ring-green-500 focus:border-green-500':
        'focus:ring-red-500 focus:border-red-500',
      )}
    >
      +$10
    </button>
    <button
      type="button"
      onClick={amountDeltaOnClickFn(50)}
      className={classNames(
        `-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1`,
        amountSign === 1 ?
        'focus:ring-green-500 focus:border-green-500':
        'focus:ring-red-500 focus:border-red-500',
      )}
    >
      +$50
    </button>
    <button
      type="button"
      onClick={amountDeltaOnClickFn(100)}
      className={classNames(
        `-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1`,
        amountSign === 1 ?
        'focus:ring-green-500 focus:border-green-500':
        'focus:ring-red-500 focus:border-red-500',
      )}
    >
      +$100
    </button>
    <button
      type="button"
      onClick={amountDeltaOnClickFn(500)}
      className={classNames(
        `-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1`,
        amountSign === 1 ?
        'focus:ring-green-500 focus:border-green-500':
        'focus:ring-red-500 focus:border-red-500',
      )}
    >
      +$500
    </button>
    <button
      type="button"
      onClick={amountDeltaOnClickFn(1000)}
      className={classNames(
        `-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1`,
        amountSign === 1 ?
        'focus:ring-green-500 focus:border-green-500':
        'focus:ring-red-500 focus:border-red-500',
      )}
    >
      +$1K
    </button>
    <button
      type="button"
      onClick={amountDeltaOnClickFn(amount * -1)}
      className={classNames(
        `-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1`,
        amountSign === 1 ?
        'focus:ring-green-500 focus:border-green-500':
        'focus:ring-red-500 focus:border-red-500',
      )}
    >
      Reset
    </button>
  </span>
)

const LogSpendForm = ({ name, onEnvelopeSubmit, uncategorized, budgetEnvelopes=[], onCancelForm, targetSpend, thisPeriodSpent, lastPeriodSpent }: {
  name: string,
  uncategorized: boolean,
  budgetEnvelopes?: BudgetEnvelope[],
  onEnvelopeSubmit?: Function,
  period: EnvelopePeriod,
  onCancelForm: () => void,
  targetSpend?: number,
  thisPeriodSpent?: number,
  lastPeriodSpent?: number,
}) => {
  const amountState: State = useState(0)
  const amountSignState: State = useState(-1)
  const amountOnFocus: State = useState(false)
  const uncategorizedState: State = useState(uncategorized)
  const nameState: State = useState(name)
  const amountChangeBlur: State = useState(false)
  const cancelling: State = useState(false)
  const activePeriodType: State = useState(ActivePeriodType.This)
  const hashtagValue: State = useState('')
  const hashtags: State = useState([])
  const activePeriodSpent: number | undefined = activePeriodType.get() === ActivePeriodType.This ?
    thisPeriodSpent : lastPeriodSpent
  const amountDeltaOnClickFn = (delta: number) => () => {
    amountState.set((prop: number) => prop + delta)
    amountChangeBlur.set(true)
  }
  const addHashtag = (val: string) => hashtags.merge(val)
  if (amountChangeBlur.get()) {
    setTimeout(() => amountChangeBlur.set(false), 75);
  }
  const limitedName = nameState.get().length > 30 ?
    nameState.get().substr(0, 30) + '…' : nameState.get()
  const adjustedSpent = activePeriodSpent ?
    activePeriodSpent - (amountState.get() * amountSignState.get())
    : 0
  const amountInputSizeClassName = amountState.get().toDollarFormat().length > 8 ?
    'mt-4 text-lg' :
    amountState.get().toDollarFormat().length > 4 ? 'mt-3.5 text-2xl' : 'mt-2 text-4xl'
  
  return (
    <div className={classNames(
      `${styles.container} relative spend-form ml-3 mt-1 mb-8 h-auto ${
        cancelling.get() ? styles.cancelling : ''
      }`,
      uncategorizedState.get() ? styles.uncategorized : ''
    )} style={{
      overflow: 'hidden',
      transition: 'height 0.3s ease-in-out, margin-top 0.3s ease-in-out, margin-bottom 0.3s ease-in-out'
    }}>
      <div className="absolute top-0 px-2 py-6 cursor-pointer
        text-gray-300 hover:text-gray-600 right-0"
        onClick={onCancelForm}>
        <XIcon className="h-10 w-10" />
      </div>
      <form onSubmit={(e) => {
        e.preventDefault()
        if (onEnvelopeSubmit &&
          activePeriodSpent !== undefined &&
          targetSpend !== undefined) {
          const newActivePeriodSpent = amountSignState.get() === -1 ?
            activePeriodSpent + amountState.get() : activePeriodSpent
          const newTargetSpend = amountSignState.get() === 1 ?
            targetSpend + amountState.get() : targetSpend
          onEnvelopeSubmit(
            newActivePeriodSpent,
            newTargetSpend,
            activePeriodType.get(),
            amountState.get(),
            amountSignState.get()
          )
          .then(() => amountState.set(0))
        } else if (uncategorizedState.get()) {
          // submission of uncategorized spend
        }
      }}>
        <div className="flex mb-1 mt-5">
          <button type="button" style={{ width: 130 }}
          onClick={() => amountSignState.set((prop: number) => prop * -1)}
          className="ml-3
            text-slate-600 border-2 border-slate-600 hover:text-black h-10 align-middle mt-2.5 px-3 rounded-md
            ">
            {
              amountSignState.get() === -1 ? 'Withdraw' : 'Deposit'
            } <SwitchVerticalIcon className="inline ml-1 h-6 w-6" /> 
          </button>
          <span className="inline-block align-middle mb-2 ml-4 mr-3">
            <button
              type="button"
              className="ml-3 relative inline-flex items-center
                align-top mt-1
                font-medium
                text-gray-700 hover:text-green-500
                "
            >
              <MinusIcon
                onClick={() => {
                  amountState.set((prop: number) => Math.max(0, prop - 1))
                  amountChangeBlur.set(true)
                }}
                className="mt-3 h-7 w-7" /> 
            </button>
            {
              amountOnFocus.get() ?
              <input
                style={{width: 100}}
                className={classNames(
                  "align-middle text-gray-700 text-center inline-block",
                  amountInputSizeClassName
                )}
                type="number"
                value={amountState.get() === 0 ? '' : amountState.get()}
                autoFocus={true}
                onChange={e => amountState.set(Number(e.target.value))}
                onFocus={() => amountOnFocus.set(true)}
                onBlur={() => amountOnFocus.set(false)}
              /> :
              <span
                style={{width: 120}}
                onClick={() => amountOnFocus.set(true)}
                className={`text-center inline-block text-gray-700 ${amountInputSizeClassName}`}>
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
              <PlusIcon
                onClick={() => {
                  amountState.set(amountState.get() + 1)
                  amountChangeBlur.set(true)
                }}
                className="mt-3 h-7 w-7" /> 
            </button>
          </span>
          {
            !uncategorizedState.get() && targetSpend !== undefined ?
            <span className="ml-3 mt-1">
              <div className="font-semibold text-lg">${(targetSpend - adjustedSpent).toDollarFormat()}</div>
              <div className="text-gray-400 text-sm">adjusted availability</div>
            </span>
            : null
          }
        </div>
        <div className="flex-shrink-0">
          <div className="mt-4" style={{marginLeft: 16}}>
            <PickAmountDelta
              amount={amountState.get()}
              amountDeltaOnClickFn={amountDeltaOnClickFn}
              amountSign={amountSignState.get()}
            />
          </div>
          <div className="mt-5 md:mt-2 ml-4 text-sm">
            <div className="md:grid
              grid-cols-1" style={{maxWidth: 488}}>
              <div className="mt-1 mb-1">
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AnnotationIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    className={classNames(
                      "block border bg-white pl-9 pr-2 py-2 focus:ring-gray-300 focus:border-gray-300 block w-full sm:text-sm border-slate-400 rounded-md",
                      amountInputSizeClassName,
                    )}
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
                    border bg-white
                    pl-9 pr-2 py-2
                    focus:ring-gray-300
                    focus:border-gray-300
                    block w-full sm:text-sm
                    border-slate-400 rounded-md"
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
          <div>
          </div>
          {
            uncategorizedState.get() ?
            <div className="mb-5 text-sm mt-4 ml-4" style={{maxWidth: 488}}>
              <header className="text-slate-700 mb-3">Select Envelope</header>
              <div className="mt-4 mb-2">
                <EnvelopeTag isUncategorized={true} onClick={() => null}>Uncategorized</EnvelopeTag>
                <EnvelopeTag onClick={() => null}>Groceries</EnvelopeTag>
                <EnvelopeTag onClick={() => null}>Store</EnvelopeTag>
              </div>
            </div>
            : null
          }
          <div className="mt-4 ml-4" style={{maxWidth: 488}}>
            <button type="submit"
              style={{marginTop: 2}}
              className={classNames(
                'block rounded-lg',
                'w-full py-2.5 text-sm leading-5 font-medium',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-800 ring-white ring-opacity-60',
                'bg-gray-800 hover:bg-gray-700 ease-in text-white px-3'
              )}>
                {
                  amountSignState.get() === -1 ? <span>
                    <ArrowDownIcon className="h-4 w-5 inline-block mr-1 align-top mt-1" /> <span className="text-base">
                      Withdraw ${amountState.get().toDollarFormat()}{
                        uncategorizedState.get() ? '' : ` from ${limitedName}`
                      }
                    </span>
                  </span> : <span>
                    <ArrowUpIcon className="h-4 w-5 inline-block mr-1 align-top mt-1" /> <span className="text-base">
                      Deposit ${Math.abs(amountState.get()).toDollarFormat()}{
                        uncategorizedState.get() ? '' : ` to ${limitedName}`
                      }
                    </span>
                  </span>
                }
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default LogSpendForm
