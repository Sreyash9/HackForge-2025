import React, { useEffect, useState } from 'react';

interface Dumpyard {
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

const demoDumpyards: Dumpyard[] = [
  { name: 'Green Valley Dumpyard', lat: 28.6139, lng: 77.209, address: 'Connaught Place, New Delhi' },
  { name: 'Eco Waste Center', lat: 28.5355, lng: 77.391, address: 'Sector 18, Noida' },
  { name: 'Urban Clean Dumpyard', lat: 28.4089, lng: 77.3178, address: 'Sector 15, Gurugram' },
];

export const DumpyardMap: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => setError('Location access denied or unavailable.')
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  // Haversine formula to calculate distance in km between two lat/lng
  function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Find nearby dumpyards (within 30km)
  const getNearby = () => {
    if (!location) return demoDumpyards;
    return demoDumpyards.filter(d => getDistanceKm(location.lat, location.lng, d.lat, d.lng) <= 30);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-center">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Nearby Dumpyard Locations</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {!location && !error && <div className="text-gray-500 mb-4">Detecting your location...</div>}
      <div className="bg-white rounded-xl shadow p-6">
        <ul className="space-y-4">
          {getNearby().map((d, i) => (
            <li key={i} className="border-b pb-3 text-left">
              <div className="font-semibold text-lg text-green-800">{d.name}</div>
              <div className="text-gray-700">{d.address}</div>
              <div className="text-gray-500 text-sm">Lat: {d.lat}, Lng: {d.lng}</div>
            </li>
          ))}
        </ul>
        {getNearby().length === 0 && <div className="text-gray-500">No dumpyards found nearby.</div>}
      </div>
      <div className="mt-6">
        <iframe
          title="Map"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: '12px' }}
          loading="lazy"
          allowFullScreen
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${location ? location.lng-0.1 : 77.1}%2C${location ? location.lat-0.1 : 28.5}%2C${location ? location.lng+0.1 : 77.5}%2C${location ? location.lat+0.1 : 28.7}&layer=mapnik`}
        ></iframe>
      </div>
    </div>
  );
};
