import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import { useAuth } from "../context/AuthContext"
import MapPicker from "../components/MapPicker"

// The fixed list of problem categories for Phase 1.
// To change them: edit this array; the dropdown and landing page both read from it.
export const CATEGORIES = [
  "Infrastructure / Roads",
  "Water & Sanitation",
  "Health",
  "Education",
  "Agriculture",
]

const MAX_PHOTOS        = 5
const MAX_FILE_SIZE_MB  = 10

export default function Submit() {
  const { session } = useAuth()
  const navigate = useNavigate()

  // Form field state
  const [title,       setTitle]       = useState("")
  const [description, setDescription] = useState("")
  const [category,    setCategory]    = useState(CATEGORIES[0])
  const [location,    setLocation]    = useState(null)   // { lat, lng } | null
  const [photos,      setPhotos]      = useState([])     // File[]
  const [errors,      setErrors]      = useState({})
  const [submitting,  setSubmitting]  = useState(false)

  // --- Photo selection ---
  function handlePhotoChange(e) {
    const files = Array.from(e.target.files).filter((f) => {
      if (!f.type.startsWith("image/")) return false
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) return false
      return true
    })
    setPhotos(files.slice(0, MAX_PHOTOS))
  }

  // --- Validation ---
  function validate() {
    const next = {}
    if (!title.trim())       next.title       = "Title is required."
    if (!description.trim()) next.description = "Description is required."
    if (!location)           next.location    = "Please pin your location on the map."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  // --- Submit handler ---
  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    try {
      // 1. Upload photos → get public URLs
      const mediaUrls = []
      for (const photo of photos) {
        const ext  = photo.name.split(".").pop()
        const path = `${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from("problem-media")
          .upload(path, photo)
        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from("problem-media")
          .getPublicUrl(path)
        mediaUrls.push(publicUrl)
      }

      // 2. Insert the problem row
      const { data, error: insertError } = await supabase
        .from("problems")
        .insert({
          title:        title.trim(),
          description:  description.trim(),
          category,
          lat:          location.lat,
          lng:          location.lng,
          media:        mediaUrls,
          status:       "Submitted",
          submitted_by: session.user.id,
        })
        .select("id")
        .single()

      if (insertError) throw insertError

      // 3. Navigate to the tracking page
      navigate(`/track/${data.id}`)

    } catch (err) {
      console.error("Submit error:", err)
      setErrors((prev) => ({
        ...prev,
        submit: err.message || "Something went wrong. Please try again.",
      }))
    } finally {
      setSubmitting(false)
    }
  }

  // ── UI ──
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3.5 mb-6">
          <img
            src="/logo.png"
            alt="समाधान सेतु"
            className="w-12 h-12 object-contain bg-white p-1.5 rounded-2xl shadow-xs border border-gray-200"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              समस्या दर्ज करें · Report a Problem
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              <span className="text-[#74C476]">समाधान सेतु</span> — Fill in as much detail as you can. AI will help score and prioritise your report.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-8 space-y-7">

          {/* ── Title ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              maxLength={120}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors((p) => ({ ...p, title: "" }))
              }}
              placeholder="e.g. Road full of potholes near Rampur village"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400 ${
                errors.title ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title}</p>
            )}
          </div>

          {/* ── Category ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* ── Description ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              maxLength={1000}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (errors.description) setErrors((p) => ({ ...p, description: "" }))
              }}
              placeholder="Describe the problem — what you see, how long it has been there, how many people are affected…"
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400 resize-none ${
                errors.description ? "border-red-400" : "border-gray-300"
              }`}
            />
            <div className="flex justify-between mt-0.5">
              {errors.description
                ? <p className="text-xs text-red-500">{errors.description}</p>
                : <span />}
              <p className="text-xs text-gray-400">{description.length}/1000</p>
            </div>
          </div>

          {/* ── Photos ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photos{" "}
              <span className="font-normal text-gray-400">
                (optional · up to {MAX_PHOTOS} images · max {MAX_FILE_SIZE_MB} MB each)
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-500
                file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0
                file:text-sm file:font-medium file:bg-saffron-50 file:text-saffron-700
                hover:file:bg-saffron-100"
            />
            {/* Preview thumbnails */}
            {photos.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {photos.map((photo, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(photo)}
                    alt={`Preview ${i + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Map ── */}
          <div>
            <MapPicker value={location} onChange={setLocation} />
            {errors.location && (
              <p className="mt-1 text-xs text-red-500">{errors.location}</p>
            )}
          </div>

          {/* ── Submit error ── */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              ⚠️ {errors.submit}
            </div>
          )}

          {/* ── Submit button ── */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-saffron-500 hover:bg-saffron-600 text-white font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {submitting ? "⏳ Submitting…" : "🚩 Submit Report"}
          </button>
        </form>
      </div>
    </div>
  )
}
