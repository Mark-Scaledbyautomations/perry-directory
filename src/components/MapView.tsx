import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Leaflet's default marker icon references image files that Vite does not
// resolve, so the pin renders broken. We point the icon at a stable
// inline SVG so the marker always draws without needing extra assets.
const icon = L.divIcon({
  className: 'map-pin',
  html: `<svg width="30" height="40" viewBox="0 0 30 40" aria-hidden="true"><path d="M15 0C6.7 0 0 6.7 0 15c0 11.2 15 25 15 25s15-13.8 15-25C30 6.7 23.3 0 15 0z" fill="#1b5bd7"/><circle cx="15" cy="15" r="6" fill="#fff"/></svg>`,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -38],
})

export function MapView({ latitude, longitude }: { latitude: number; longitude: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) return
    const map = L.map(ref.current, { scrollWheelZoom: true })
    map.setView([latitude, longitude], 16)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)
    L.marker([latitude, longitude], { icon }).addTo(map)
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [latitude, longitude])

  return <div className="map-view" ref={ref} role="region" aria-label="Map location" />
}
