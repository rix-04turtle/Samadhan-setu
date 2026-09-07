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
      <Link to="/" className="flex items-center gap-3 group">
        <img
          src="/logo.png"
          alt="SamadhanSetu Logo"
          className="w-10 h-10 object-contain rounded-lg shadow-xs"
        />
        <span className="font-extrabold text-[#74C476] text-xl tracking-tight group-hover:text-[#74C476] transition-colors">
          समाधान सेतु
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
