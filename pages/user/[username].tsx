import { useRouter } from 'next/router'

import styles from './user.module.css'
import { MailOpenIcon } from '@heroicons/react/solid'
import { PlusCircleIcon, MailIcon } from '@heroicons/react/outline'
import EnvelopeItem, { EnvelopePeriod, ActivePeriodType } from '../../components/EnvelopeItem'



const User = () => {
  const router = useRouter()
  const { username } = router.query

  return (
    <main className="md:container my-5 mx-auto">
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
            this month
          </button>
          <button type="button" className="rounded-md text-gray-400
            hover:text-gray-700 hover:bg-gray-100
            mr-3 px-2 py-1">
            last month
          </button>
        </nav>
        <EnvelopeItem name="Groceries" period={EnvelopePeriod.Month} periodType={ActivePeriodType.This} spentActivePeriod={190.5} targetSpend={200} />
        <EnvelopeItem name="Entertainment" period={EnvelopePeriod.Month} periodType={ActivePeriodType.This} spentActivePeriod={100} targetSpend={300} />
        <EnvelopeItem name="Replenish House" period={EnvelopePeriod.Month} periodType={ActivePeriodType.This} targetSpend={300} />
      </div>
    </main>
  )
}

export default User
