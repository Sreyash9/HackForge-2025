"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

type Buyer = {
  id: number
  name: string
  company: string
  rating: number
  lat: number
  lon: number
}

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export default function BuyersMap({ buyers }: { buyers: Buyer[] }) {
  const center = buyers.length ? [buyers[0].lat, buyers[0].lon] as [number, number] : [18.52, 73.86]
  const maptilerKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY
  const url = `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${maptilerKey}`

  return (
    <div className="h-64 w-full overflow-hidden rounded-lg border">
      <MapContainer center={center} zoom={7} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer url={url} attribution="&copy; MapTiler & OpenStreetMap contributors" />
        {buyers.filter(b => b.lat && b.lon).map((b) => (
          <Marker key={b.id} position={[b.lat, b.lon]} icon={icon}>
            <Popup>
              <div className="text-sm">
                <div className="font-medium">{b.name}</div>
                <div className="text-muted-foreground">{b.company}</div>
                <div>⭐ {b.rating}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}


