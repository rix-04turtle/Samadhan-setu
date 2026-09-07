import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [email,   setEmail]   = useState("")
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")

  const { session } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get("next") || "/submit"

  // If already signed in, skip straight to the destination
  useEffect(() => {
    if (session) navigate(next, { replace: true })
  }, [session, navigate, next])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // After clicking the link, Supabase redirects here.
        // The client automatically parses the #access_token fragment.
        emailRedirectTo: window.location.origin + next,
      },
    })

    if (authError) {
      setError(authError.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  // ── Sent state ──
  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-sm w-full text-center">
          <img
            src="/logo.png"
            alt="समाधान सेतु"
            className="w-16 h-16 object-contain mx-auto mb-3"
          />
          <h2 className="text-xl font-bold text-gray-800 mb-1">Check your email</h2>
          <p className="text-xs font-semibold text-[#74C476] mb-3">समाधान सेतु</p>
          <p className="text-sm text-gray-500 leading-relaxed">
            We sent a magic sign-in link to{" "}
            <strong className="text-gray-700">{email}</strong>.
            Click it to continue — no password required.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-6 text-xs text-gray-400 hover:text-gray-600 underline"
          >
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  // ── Email form ──
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-10 max-w-sm w-full">
        <div className="flex flex-col items-center mb-5 text-center">
          <img
            src="/logo.png"
            alt="समाधान सेतु"
            className="w-16 h-16 object-contain mb-2"
          />
          <h1 className="text-xl font-extrabold text-[#74C476]">समाधान सेतु</h1>
        </div>

        <h2 className="text-lg font-bold text-gray-800 mb-1">Sign in</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your email — we will send you a one-click sign-in link.
          No password needed.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-saffron-500 hover:bg-saffron-600 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send magic link →"}
          </button>
        </form>
      </div>
    </div>
  )
}
