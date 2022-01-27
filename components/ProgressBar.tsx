const ProgressBar = ({
  target,
  spent
}: {
  target: number,
  spent: number
}) => {
  const percent100 = Math.round(((target - spent)/target) * 100);
  return (
    <div className="inline-block align-top
      mt-2
      mr-2 bg-slate-200 rounded-full" style={{width: 100}}>
      <div
        className={`bg-green-400 text-xs opacity-0.6 font-medium text-slate-300
        text-center p-0.25 leading-none rounded-l-full`}
        style={{
          width: percent100,
          height: 5,
        }}></div>
    </div>
  )
}

export default ProgressBar
