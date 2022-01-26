import { useRouter } from 'next/router'
import { useState, State } from '@hookstate/core';

import styles from './user.module.css'
import { MailOpenIcon } from '@heroicons/react/solid'
import { PlusCircleIcon, MailIcon } from '@heroicons/react/outline'
import EnvelopeItem, { EnvelopePeriod, ActivePeriodType } from '../../components/EnvelopeItem'
import { useEffect } from 'react'

const API_URL = 'http://localhost:5000'

interface BudgetItem {
  id: string;
  user_id: number;
  budget_id: number;
  name: string;
  target: number;
  period: EnvelopePeriod;
  spent_this_period: number;
  spent_last_period: number;
}

const User = () => {
  const router = useRouter()
  const { username } = router.query
  const budgetItemsState: State = useState([] as BudgetItem[])

  useEffect(() => {
    if (username) {
      fetch(`${API_URL}/users?username=${username}`)
      .then(r => r.json())
      .then(([user]) => {
        if (user) {
          const [firstBudgetId] = user.budget_ids;
          if (firstBudgetId) return firstBudgetId;
        }
      })
      .then(budgetId => {
        if (budgetId === undefined) return;
        return fetch(`${API_URL}/budget_items?budget_id=${budgetId}`)
      })
      .then(r => r.json())
      .then(budgetItems => {
        console.log('items', budgetItems)
        budgetItemsState.set(budgetItems as BudgetItem[])
      })
    }
  }, [username])
  
  if (budgetItemsState.get().length == 0) return null;

  const budgetPeriod = budgetItemsState.get()[0].period
  return (
    <main className="md:container my-5 mx-auto px-4">
      <div className={styles.budget}>
        <div className="mb-6">
          <span className="text-2xl font-semibold">
            <MailOpenIcon className="h-7 w-7 inline align-top" /> {username}'s budget envelopes
          </span>
        </div>
        <h2 className="flex text-lg font-semibold text-gray-700">
          <span className="text-2xl">Monthly</span> <button type="button" style={{ marginTop: -5}} className="px-1
            bg-yellow-100 hover:bg-yellow-200 py-1 px-2 rounded-md
            text-sm ml-3 mt-2
            hover:text-gray-900">
            <PlusCircleIcon className="inline h-5 w-5" /> <MailIcon className="inline h-5 w-5" />
          </button>
          <div className="flex-1 text-right align-middle mr-4">
            <span className="text-2xl">
              <span className="font-light text-gray-400">$209.50 / </span><span className="font-bold">$1,090</span>
            </span>
          </div>
        </h2>
        <nav className="mt-3">
          <button type="button" className="rounded-md text-gray-700 bg-gray-100 mr-3 px-2 py-1">
            this {budgetPeriod}
          </button>
          <button type="button" className="rounded-md text-gray-400
            hover:text-gray-700 hover:bg-gray-100
            mr-3 px-2 py-1">
            last {budgetPeriod}
          </button>
        </nav>
        {
          budgetItemsState.map((itemState: State, i: number) => {
            const item = itemState.get() as BudgetItem
            return <EnvelopeItem key={i}
              name={item.name}
              targetSpend={item.target}
              period={budgetPeriod}
              thisPeriodSpent={item.spent_this_period}
              lastPeriodSpent={item.spent_last_period}
            />
          })
        }
      </div>
    </main>
  )
}

export default User
