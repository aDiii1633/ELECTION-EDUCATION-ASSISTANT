// app/booth-finder/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Search, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { POLLING_CENTERS } from '@/lib/electionData';

interface PollingCenter {
  id: string;
  name: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  boothNo: string;
}

export default function BoothFinderPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PollingCenter[]>([]);
  const [selected, setSelected] = useState<PollingCenter | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.toLowerCase().trim();
    if (!q) {
      setResults(POLLING_CENTERS.slice(0, 6));
      setSearched(true);
      return;
    }
    const filtered = POLLING_CENTERS.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.pincode.includes(q) ||
        c.name.toLowerCase().includes(q)
    );
    setResults(filtered);
    setSearched(true);
    if (filtered.length > 0) setSelected(filtered[0]);
  };

  const getGoogleMapsUrl = (center: PollingCenter) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.name + ', ' + center.city)}`;

  const getDirectionsUrl = (center: PollingCenter) =>
    `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`;

  // Embed Google Maps iframe for selected center
  const mapSrc = selected
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${selected.lat},${selected.lng}&zoom=15`
    : `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=28.6139,77.2090&zoom=11`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Map size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Polling Booth Finder</h1>
        <p className="text-gray-500">
          Find your nearest polling station by city name or pincode.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter city or pincode (e.g. Delhi, 110001)"
              className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
              aria-label="Search polling booths"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3.5 rounded-xl transition-colors shadow-lg shadow-red-200"
          >
            <Search size={16} /> Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Results */}
        <div className="lg:col-span-2 space-y-3 max-h-[560px] overflow-y-auto pr-1">
          {!searched && (
            <div className="text-center py-16 text-gray-400">
              <MapPin size={48} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">Search for a city or pincode</p>
              <p className="text-sm mt-1">to find polling centers near you</p>
            </div>
          )}

          {searched && results.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Search size={48} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium">No polling centers found</p>
              <p className="text-sm mt-1">Try a different city or pincode</p>
            </div>
          )}

          {results.map((center) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelected(center)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selected?.id === center.id
                  ? 'border-red-300 bg-red-50 shadow-md'
                  : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
              }`}
              role="button"
              aria-label={`Select ${center.name}`}
              aria-pressed={selected?.id === center.id}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selected?.id === center.id ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  <MapPin size={18} className={selected?.id === center.id ? 'text-red-600' : 'text-gray-500'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm leading-tight">{center.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{center.city} · {center.pincode}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      Booth: {center.boothNo}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: Map */}
        <div className="lg:col-span-3">
          <div className="card-backlit overflow-hidden h-[400px] lg:h-[560px]">
            {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY &&
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== 'demo-maps-key' ? (
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Polling booth location map"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-100 to-blue-50 text-center p-6">
                <div className="text-5xl mb-4">🗺️</div>
                <h3 className="font-bold text-gray-700 text-lg mb-2">Google Maps Integration</h3>
                <p className="text-sm text-gray-500 mb-4 max-w-xs">
                  Add your <code className="bg-gray-100 px-1 rounded text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to enable the interactive map.
                </p>
                {selected && (
                  <div className="bg-white rounded-xl border p-4 text-left w-full max-w-sm">
                    <p className="font-semibold text-gray-800 text-sm">{selected.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{selected.city} · {selected.pincode}</p>
                    <p className="text-xs text-blue-600 mt-1">📍 Lat: {selected.lat}, Lng: {selected.lng}</p>
                    <div className="flex gap-2 mt-3">
                      <a href={getGoogleMapsUrl(selected)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">
                        <ExternalLink size={11} /> View on Maps
                      </a>
                      <a href={getDirectionsUrl(selected)} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs border border-blue-200 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                        <Navigation size={11} /> Directions
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions when center selected */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 card-backlit p-4 flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <p className="font-semibold text-gray-900 text-sm">{selected.name}</p>
                <p className="text-xs text-gray-500">Booth #{selected.boothNo} · {selected.city}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={getGoogleMapsUrl(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-colors"
                >
                  <ExternalLink size={14} /> Open Maps
                </a>
                <a
                  href={getDirectionsUrl(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold border border-red-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <Navigation size={14} /> Get Directions
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* API Warning */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 py-2 px-4 rounded-lg inline-flex mx-auto border border-gray-100">
        <MapPin size={14} className="text-gray-400" />
        <span>
          <strong>Map showing an error?</strong> Go to your Google Cloud Console and enable the &quot;Maps Embed API&quot; for your API Key.
        </span>
      </div>

      {/* Official link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          For official booth details, visit{' '}
          <a href="https://electoralsearch.eci.gov.in" target="_blank" rel="noopener noreferrer"
            className="text-blue-600 font-semibold hover:underline">
            electoralsearch.eci.gov.in ↗
          </a>
        </p>
      </div>
    </div>
  );
}
