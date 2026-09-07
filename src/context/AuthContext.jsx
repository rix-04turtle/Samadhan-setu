import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

// ------------------------------------------------------------------
// AuthContext — wraps Supabase Auth so any component can call
// useAuth() to get the current session without prop-drilling.
// ------------------------------------------------------------------

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)  // true until first auth check resolves

  useEffect(() => {
    // 1. Get whatever session already exists (e.g. from a previous visit)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 2. Keep in sync whenever the user signs in/out or the token refreshes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Cleanup listener when the component unmounts
    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

/** Call this inside any component to get { session, loading } */
export function useAuth() {
  return useContext(AuthContext)
}
