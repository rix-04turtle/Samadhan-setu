export default function ComingSoon({ title = "This Portal", phase }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <img
          src="/logo.png"
          alt="समाधान सेतु"
          className="w-20 h-20 object-contain mx-auto mb-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{title}</h2>
        <p className="text-xs font-semibold text-[#74C476] mb-3">समाधान सेतु</p>
        {phase && (
          <p className="text-xs text-gray-400 mb-2">Coming in Phase {phase}</p>
        )}
        <p className="text-sm text-gray-500">
          This section is not built yet — check back after the next phase is approved.
        </p>
      </div>
    </div>
  )
}
