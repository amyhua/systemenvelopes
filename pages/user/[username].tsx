import { useRouter } from 'next/router'
import { useState, State } from '@hookstate/core';

import styles from './user.module.css'
import { MailOpenIcon, MailIcon, CurrencyDollarIcon, PlusIcon } from '@heroicons/react/solid'
import { PlusCircleIcon, CalendarIcon } from '@heroicons/react/outline'
import EnvelopeItem from '../../components/EnvelopeItem'
import { useEffect } from 'react'
import ProgressBar from '../../components/ProgressBar';
import { getDaysInThisMonth, classNames, getSpentHealthTextColorClassName } from '../../utils/app-utils';
import { ActivePeriodType, EnvelopePeriod, BudgetEnvelope, BudgetTotal } from '../../types';
import BudgetPeriodButton from '../../components/BudgetPeriodButton';
import LogSpendForm from '../../components/LogSpendForm';
import Budget from '../../components/Budget';

const API_URL = 'http://localhost:5000'

const fetchBudgetEnvelopes = (budgetId: number) =>
  fetch(`${API_URL}/budget_envelopes?budget_id=${budgetId}`)

const User = () => {
  const router = useRouter()
  const { username } = router.query
  const budgetEnvelopesState: State = useState([] as BudgetEnvelope[])
  const budgetTotal: State = useState({
    period: null,
    spentLastPeriod: 0,
    spentThisPeriod: 0,
    targetSum: 0,
  })
  
  useEffect(() => {
    if (username) {
      fetch(`${API_URL}/users?username=${username}`)
      .then((r: any) => r.json())
      .then(([user]) => {
        if (user) {
          const [firstBudgetId] = user.budgetIds;
          if (firstBudgetId) return firstBudgetId;
        }
      })
      .then(budgetId => {
        if (budgetId === undefined) return;
        return fetchBudgetEnvelopes(budgetId)
      })
      .then((r: any) => r.json())
      .then(budgetEnvelopes => {
        budgetEnvelopesState.set(budgetEnvelopes as BudgetEnvelope[])
        if (budgetEnvelopes.length) {
          const budgetTotalVal : BudgetTotal = budgetEnvelopesState.get().reduce(
            (result: BudgetTotal, item: BudgetEnvelope) => {
              result.period = item.period as EnvelopePeriod
              result.spentLastPeriod += item.lastPeriodSpent
              result.spentThisPeriod += item.thisPeriodSpent
              result.targetSum += item.targetSpend
              return result
            }, {
              period: null,
              spentLastPeriod: 0,
              spentThisPeriod: 0,
              targetSum: 0,
            })
          budgetTotal.set(budgetTotalVal)
        }
      })
    }
  }, [username])

  if (budgetEnvelopesState.get().length === 0) return null

  return (
    <main className="p-5 bg-slate-200">
      <Budget
        envelopes={budgetEnvelopesState}
        budgetTotal={budgetTotal}
      />
    </main>
  )
}

export default User
