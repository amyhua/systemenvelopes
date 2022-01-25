import { PencilAltIcon } from '@heroicons/react/solid'

export enum EnvelopePeriod {
  Month = 'month',
  Week = 'week',
  Year = 'year'
}

const EnvelopeItem = ({
  name, spentLastPeriod, targetSpend=0, period='month',
}: {
  name: string,
  targetSpend: number,
  spentLastPeriod?: number,
  period: EnvelopePeriod,
}) => {
  return (
    <div className="bg-white py-5 border-b border-gray-200 sm:px-2">
      <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
        <div className="ml-4 mt-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {
              spentLastPeriod !== undefined ?
              <>
                <span className="text-blue-600 font-semibold">${spentLastPeriod}</span> spent last {period}{' '}
                <span className={`ml-2 text-${
                  targetSpend < spentLastPeriod ? 'red' : 'green'
                }-500`}>+${(targetSpend - spentLastPeriod).toFixed(2)} saved</span>
              </> :
              'No spending logged last ' + period
            }
          </p>
        </div>
        <div className="ml-4 mt-4 flex-shrink-0">
          <span className="mr-4 text-xl font-semibold">
            $200
          </span>
          <button
            type="button"
            className="relative inline-flex items-center px-2 py-2 border border-transparent shadow-sm text-sm
              font-medium rounded-md text-white
              bg-gray-300 hover:bg-gray-400
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <PencilAltIcon className="h-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default EnvelopeItem
