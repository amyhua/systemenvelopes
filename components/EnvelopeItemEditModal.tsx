import { useState, State } from '@hookstate/core';

const EnvelopeItemEditModal = ({ defaultName }: {
  defaultName: string,
}) => {
  const nameState: State = useState(defaultName)
  return (
    <section className="ml-7 mt-4">
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

export default EnvelopeItemEditModal
