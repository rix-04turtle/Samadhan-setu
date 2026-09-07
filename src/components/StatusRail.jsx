// The five lifecycle steps every problem passes through.
// Phase 7 will add animation; for now it is purely visual.
const STEPS = [
  { key: "Submitted",    label: "Submitted" },
  { key: "Under Review", label: "Under Review" },
  { key: "Assigned",     label: "Assigned" },
  { key: "In Progress",  label: "In Progress" },
  { key: "Resolved",     label: "Resolved" },
]

export default function StatusRail({ currentStatus }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStatus)

  return (
    <div className="w-full overflow-x-auto pb-2">
      <ol className="flex items-start min-w-max">
        {STEPS.map((step, index) => {
          const isDone     = index < currentIndex
          const isCurrent  = index === currentIndex
          const isUpcoming = index > currentIndex

          return (
            <li key={step.key} className="flex items-center">
              {/* Step circle + label */}
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors",
                    isDone    ? "bg-india-green-500 border-india-green-500 text-white" : "",
                    isCurrent ? "bg-saffron-500 border-saffron-500 text-white"        : "",
                    isUpcoming? "bg-white border-gray-300 text-gray-400"              : "",
                  ].join(" ")}
                >
                  {isDone ? "✓" : index + 1}
                </div>
                <span
                  className={[
                    "mt-1 text-xs font-medium text-center w-20 leading-tight",
                    isDone    ? "text-india-green-600" : "",
                    isCurrent ? "text-saffron-600"     : "",
                    isUpcoming? "text-gray-400"         : "",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector between circles */}
              {index < STEPS.length - 1 && (
                <div
                  className={[
                    "h-0.5 w-12 mx-1 mt-[-12px] transition-colors",
                    index < currentIndex ? "bg-india-green-500" : "bg-gray-200",
                  ].join(" ")}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
