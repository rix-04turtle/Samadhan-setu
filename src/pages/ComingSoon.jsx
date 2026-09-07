export default function ComingSoon({ title = "This Portal", phase }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl mb-4">🚧</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        {phase && (
          <p className="text-sm text-gray-400 mb-1">Coming in Phase {phase}</p>
        )}
        <p className="text-sm text-gray-500">
          This section is not built yet — check back after the next phase is approved.
        </p>
      </div>
    </div>
  )
}
