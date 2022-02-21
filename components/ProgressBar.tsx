import { classNames } from "../utils/app-utils";

const ProgressBar = ({
  target,
  spent,
  top=8,
  width=100,
}: {
  target: number,
  spent: number,
  top: number,
  width?: number,
}) => {
  const percent100 = Math.min(width, Math.round((spent/target) * width));
  return (
    <div className="inline-block align-top
      bg-slate-200 rounded-full" style={{marginTop: top, width }}>
      <div
        className={classNames(
          'text-xs opacity-0.6 font-medium text-slate-300',
          'text-center p-0.25 leading-none rounded-l-full',
          percent100 === width ? 'bg-red-400' : 'bg-slate-500'
        )}
        style={{
          width: percent100,
          height: 5,
        }}></div>
    </div>
  )
}

export default ProgressBar
