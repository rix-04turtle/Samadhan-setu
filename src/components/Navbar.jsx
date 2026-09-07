import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { session } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate("/")
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        {/* Mini tricolour */}
        <span className="flex gap-0.5 items-center">
          <span className="w-1.5 h-6 rounded-sm bg-saffron-500" />
          <span className="w-1.5 h-6 rounded-sm bg-gray-100 border border-gray-200" />
          <span className="w-1.5 h-6 rounded-sm bg-india-green-500" />
        </span>
        <span className="font-bold text-gray-800 text-lg tracking-tight">
          SamadhanSetu
        </span>
      </Link>

      {/* Right-side actions */}
      <div className="flex items-center gap-5">
        {session ? (
          <>
            <Link
              to="/submit"
              className="text-sm font-medium text-saffron-600 hover:text-saffron-700"
            >
              Report a Problem
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Sign out
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="text-sm font-medium text-saffron-600 hover:text-saffron-700"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  )
}
