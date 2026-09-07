import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Submit from "./pages/Submit"
import Track from "./pages/Track"
import ComingSoon from "./pages/ComingSoon"

// ------------------------------------------------------------------
// ProtectedRoute — redirects unauthenticated users to /login,
// preserving the intended destination as ?next=<path>
// ------------------------------------------------------------------
function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        Loading…
      </div>
    )
  }

  if (!session) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    )
  }

  return children
}

// ------------------------------------------------------------------
// AppRoutes — all routes live here, inside BrowserRouter + AuthProvider
// ------------------------------------------------------------------
function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Phase 1 */}
        <Route
          path="/submit"
          element={<ProtectedRoute><Submit /></ProtectedRoute>}
        />
        <Route
          path="/track/:problemId"
          element={<ProtectedRoute><Track /></ProtectedRoute>}
        />

        {/* Future phases — scaffolded as placeholders so links never 404 */}
        <Route path="/reviewer"   element={<ComingSoon title="Reviewer Portal" phase={5} />} />
        <Route path="/university" element={<ComingSoon title="University Portal" phase={6} />} />
        <Route path="/industry"   element={<ComingSoon title="Industry Portal" phase={6} />} />
        <Route path="/admin"      element={<ComingSoon title="Admin Dashboard" phase={7} />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
