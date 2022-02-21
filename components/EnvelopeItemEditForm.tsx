import { useState, State } from '@hookstate/core';

const EnvelopeItemEditForm = ({ name, targetSpend }: {
  name: string,
  targetSpend: number,
}) => {
  const nameState: State = useState(name)
  const targetSpendState: State = useState(targetSpend)
  return (
    <section className="relative p-7 bg-white rounded max-w-sm mx-auto">
      <label htmlFor="name" className="block text-sm font-medium text-gray-500">
        Name
      </label>
      <div className="mt-1 mb-4">
        <input
          type="text"
          name="name"
          id="name"
          className="py-2
          block w-full sm:text-sm border-b-2 border-b-gray-500"
          placeholder="Groceries"
          value={nameState.get()}
        />
      </div>
    </section>
  )
}

export default EnvelopeItemEditForm
