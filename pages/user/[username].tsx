import { useRouter } from 'next/router'
import styles from './user.module.css'
import { MailOpenIcon, PencilAltIcon } from '@heroicons/react/solid'
import EnvelopeItem, { EnvelopePeriod } from '../../components/EnvelopeItem'


const User = () => {
  const router = useRouter()
  const { username } = router.query

  return (
    <main className="md:container my-5 mx-5">
      <div className={styles.budget}>
        <div className="mb-4">
          <span className="text-2xl font-semibold text-blue-500">
            <MailOpenIcon className="h-7 w-7 inline align-top" /> {username}'s budget envelopes
          </span>
        </div>
        <h2 className="text-lg font-semibold text-gray-700">
          Monthly
        </h2>
        <EnvelopeItem name="Groceries" period={EnvelopePeriod.Month} spentLastPeriod={190.5} targetSpend={200} />
        <EnvelopeItem name="Entertainment" period={EnvelopePeriod.Month} spentLastPeriod={100} targetSpend={300} />
        
      </div>
    </main>
  )
}

export default User
