const LogSpendButton = ({
  value
}: {
  value: number
}) => {
  const unitsOfK = (value / 1000) % 1 === 0 ? value / 1000 : 0;
  return (
    <button
      type="button" style={{marginTop: 6}}
      className="ml-2 relative inline-flex items-center
        px-2 align-top mt-0 border-2
        border-gray-400 hover:border-gray-800
        font-medium
        text-gray-400 hover:text-gray-800
        rounded-md
        "
    >
      ${unitsOfK > 0 ? unitsOfK + 'K' : value.toFixed(0)}
    </button>
  )
};

export default LogSpendButton
