import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import StatusRail from "../components/StatusRail"

const CATEGORY_ICONS = {
  "Infrastructure / Roads": "🛣️",
  "Water & Sanitation":     "💧",
  "Health":                 "🏥",
  "Education":              "📚",
  "Agriculture":            "🌾",
}

export default function Track() {
  const { problemId } = useParams()
  const [problem,  setProblem]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied,   setCopied]   = useState(false)

  useEffect(() => {
    async function fetchProblem() {
      const { data, error } = await supabase
        .from("problems")
        .select("*")
        .eq("id", problemId)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setProblem(data)
      }
      setLoading(false)
    }
    fetchProblem()
  }, [problemId])

  async function copyFullId() {
    try {
      await navigator.clipboard.writeText(problemId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available in some mobile browsers
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading your report…</p>
      </div>
    )
  }

  // ── Not found / not owned ──
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Report not found</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            This tracking ID doesn't exist or doesn't belong to your account.
          </p>
          <Link to="/" className="text-saffron-600 hover:underline text-sm font-medium">
            ← Go to home
          </Link>
        </div>
      </div>
    )
  }

  const shortId       = problemId.slice(0, 8).toUpperCase()
  const categoryIcon  = CATEGORY_ICONS[problem.category] || "📋"
  const submittedDate = new Date(problem.created_at).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Confirmation banner ── */}
        <div className="bg-india-green-500 text-white rounded-2xl p-6 shadow">
          <p className="text-sm font-medium opacity-90 mb-1">✅ Report submitted successfully</p>
          <h2 className="text-xl font-bold mb-4">{problem.title}</h2>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-sm bg-white/20 rounded-lg px-3 py-1.5 tracking-widest">
              #{shortId}
            </span>
            <button
              onClick={copyFullId}
              className="text-xs opacity-80 hover:opacity-100 underline"
            >
              {copied ? "✓ Copied!" : "Copy full ID"}
            </button>
          </div>
        </div>

        {/* ── Status rail ── */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-5">Current Status</h3>
          <StatusRail currentStatus={problem.status} />
        </div>

        {/* ── Details card ── */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-700">Report Details</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Category</p>
              <p className="font-medium text-gray-800">
                {categoryIcon} {problem.category}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Submitted on</p>
              <p className="font-medium text-gray-800">{submittedDate}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {problem.description}
            </p>
          </div>

          {/* Photos */}
          {problem.media && problem.media.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                Attached photos
              </p>
              <div className="flex gap-2 flex-wrap">
                {problem.media.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={url}
                      alt={`Photo ${i + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* AI pending notice — replaced in Phase 2 with real scores */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
            <span className="text-base">🤖</span>
            <span>
              AI analysis is pending. Severity score and priority rating will appear here
              once Phase 2 is complete.
            </span>
          </div>

          {/* Reviewer note — shown in Phase 5 if problem is returned */}
          {problem.reviewer_note && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
              <strong>Reviewer note:</strong> {problem.reviewer_note}
            </div>
          )}
        </div>

        <Link
          to="/submit"
          className="block text-center text-sm text-saffron-600 hover:underline"
        >
          + Report another problem
        </Link>
      </div>
    </div>
  )
}
