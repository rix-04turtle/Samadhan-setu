import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const CATEGORIES = [
  { icon: "🛣️", label: "Infrastructure / Roads" },
  { icon: "💧", label: "Water & Sanitation" },
  { icon: "🏥", label: "Health" },
  { icon: "📚", label: "Education" },
  { icon: "🌾", label: "Agriculture" },
]

export default function Landing() {
  const { session } = useAuth()
  const ctaHref = session ? "/submit" : "/login"

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        {/* Official Logo */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <img
              src="/logo.png"
              alt="समाधान सेतु — SamadhanSetu Logo"
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
            />
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl font-black text-[#74C476] mb-6 tracking-tight">
          समाधान सेतु
        </h1>
        <p className="text-base text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Report local problems in your own language. AI prioritises every report,
          government reviewers verify it, and universities & industries step in to solve it.
        </p>

        <Link
          to={ctaHref}
          className="inline-block bg-saffron-500 hover:bg-saffron-600 text-white font-bold px-10 py-3.5 rounded-xl text-base shadow-md transition-colors"
        >
          🚩 Report a Problem
        </Link>
      </section>

      {/* ── How it works ── */}
      <section className="bg-white border-t border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: "📝",
                step: "1. Report",
                text: "Submit a problem by text (voice coming soon) — in any language",
              },
              {
                icon: "🤖",
                step: "2. AI Review",
                text: "AI scores severity, detects duplicates, and routes to the right authority",
              },
              {
                icon: "🎓",
                step: "3. Solve",
                text: "Universities and industry partners are matched and take ownership",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-2">
                <span className="text-5xl">{item.icon}</span>
                <span className="font-bold text-gray-800">{item.step}</span>
                <span className="text-sm text-gray-500 leading-relaxed">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Problem Categories We Handle
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="bg-white border border-gray-200 rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-xs font-semibold text-gray-700 leading-snug">
                {cat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center py-10 text-xs text-gray-500 border-t border-gray-200/80 bg-white">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/logo.png" alt="समाधान सेतु" className="w-6 h-6 object-contain" />
          <span className="font-bold text-[#74C476] text-sm">समाधान सेतु</span>
        </div>
        <p className="text-gray-400">
          Smart India Hackathon 2026 · Problem Statement 26043 · Government of Jharkhand
        </p>
      </footer>
    </div>
  )
}
