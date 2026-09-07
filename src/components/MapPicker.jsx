import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import L from "leaflet"

// ---- Fix Leaflet marker icons in Vite builds ----
// Vite hashes asset filenames; Leaflet tries to load them via a relative
// URL that breaks. We import the PNGs explicitly so Vite handles them.
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon   from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl:       markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl:     markerShadow,
})
// -------------------------------------------------

// Jharkhand approximate centre
const JHARKHAND_CENTER = [23.6102, 85.2799]

/**
 * Listens for map clicks and forwards them as { lat, lng } to onLocationSelect.
 * Must be a child of <MapContainer>.
 */
function ClickHandler({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

/**
 * When value changes (e.g. after geolocation), smoothly pan the map there.
 * Must be a child of <MapContainer>.
 */
function MapController({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 15, { duration: 1 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position])
  return null
}

/**
 * MapPicker — shows a Leaflet map over Jharkhand.
 *
 * Props:
 *   value    — { lat, lng } | null
 *   onChange — called with { lat, lng } whenever the pin moves
 */
export default function MapPicker({ value, onChange }) {
  const [locating, setLocating]   = useState(false)
  const [geoError, setGeoError]   = useState("")

  function handleGeolocate() {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.")
      return
    }
    setLocating(true)
    setGeoError("")
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => {
        setGeoError("Could not get your location. Please click the map to drop a pin.")
        setLocating(false)
      }
    )
  }

  const position = value ? [value.lat, value.lng] : null

  return (
    <div className="space-y-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Location <span className="text-red-500">*</span>
        </span>
        <button
          type="button"
          onClick={handleGeolocate}
          disabled={locating}
          className="text-sm text-saffron-600 hover:text-saffron-700 disabled:opacity-50 flex items-center gap-1"
        >
          {locating ? "⏳ Locating…" : "📍 Use my location"}
        </button>
      </div>

      {/* Map */}
      <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
        <MapContainer
          center={JHARKHAND_CENTER}
          zoom={8}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* These helpers must be children of MapContainer to access the map instance */}
          <MapController position={value} />
          <ClickHandler onLocationSelect={onChange} />
          {position && (
            <Marker
              position={position}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const ll = e.target.getLatLng()
                  onChange({ lat: ll.lat, lng: ll.lng })
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Coordinate readout */}
      {position ? (
        <p className="text-xs text-gray-500">
          📌 {value.lat.toFixed(5)}°N, {value.lng.toFixed(5)}°E — drag the marker to adjust
        </p>
      ) : (
        <p className="text-xs text-gray-400">
          Click anywhere on the map to drop a pin, or use the button above.
        </p>
      )}
      {geoError && <p className="text-xs text-red-500">{geoError}</p>}
    </div>
  )
}
