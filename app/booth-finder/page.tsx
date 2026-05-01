// app/booth-finder/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Search, MapPin, Navigation, ExternalLink, LocateFixed, Loader2 } from 'lucide-react';
import { POLLING_CENTERS } from '@/lib/electionData';
import toast from 'react-hot-toast';

interface PollingCenter {
  id: string;
  name: string;
  city: string;
  pincode: string;
  lat: number;
  lng: number;
  boothNo: string;
}

const CITIES = Array.from(new Set(POLLING_CENTERS.map(c => c.city))).sort();

// Haversine formula to calculate distance in km
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export default function BoothFinderPage() {
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [results, setResults] = useState<PollingCenter[]>(POLLING_CENTERS.slice(0, 10));
  const [selected, setSelected] = useState<PollingCenter | null>(null);
  const [searched, setSearched] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleSearch = (e?: React.FormEvent, forceCity?: string) => {
    if (e) e.preventDefault();
    const q = query.toLowerCase().trim();
    const cityFilter = forceCity || selectedCity;
    
    let filtered = POLLING_CENTERS;
    
    if (cityFilter !== 'All') {
      filtered = filtered.filter(c => c.city === cityFilter);
    }
    
    if (q) {
      filtered = filtered.filter(
        (c) => c.pincode.includes(q) || c.name.toLowerCase().includes(q)
      );
    }

    setResults(filtered);
    setSearched(true);
    if (filtered.length > 0) setSelected(filtered[0]);
    else setSelected(null);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setQuery(''); // clear query when switching city
    handleSearch(undefined, city);
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    toast.loading('Finding nearest booth...', { id: 'geo' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Sort centers by distance
        const sorted = [...POLLING_CENTERS].map(center => {
          const distance = getDistanceFromLatLonInKm(latitude, longitude, center.lat, center.lng);
          return { ...center, distance };
        }).sort((a, b) => a.distance - b.distance);
        
        toast.success(`Found nearest booth in ${sorted[0].city}`, { id: 'geo' });
        setSelectedCity('All');
        setQuery('');
        setResults(sorted.slice(0, 10)); // Show top 10 nearest
        setSelected(sorted[0]);
        setSearched(true);
        setLocating(false);
      },
      (error) => {
        toast.error('Unable to retrieve your location.', { id: 'geo' });
        setLocating(false);
      }
    );
  };

  const getGoogleMapsUrl = (center: PollingCenter) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.name + ', ' + center.city)}`;

  const getDirectionsUrl = (center: PollingCenter) =>
    `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`;

  // Embed Google Maps iframe for selected center
  const mapSrc = selected
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${selected.lat},${selected.lng}&zoom=15`
    : `https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=28.6139,77.2090&zoom=5`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-[0_8px_30px_rgb(225,29,72,0.3)]">
          <Map size={32} className="text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Polling Booth Finder</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Find your designated polling station. Search by location, pincode, or find the nearest booth automatically.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="max-w-3xl mx-auto mb-8 bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by pincode or booth name..."
              className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all bg-gray-50"
              aria-label="Search polling booths"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-red-200"
          >
            <Search size={16} /> Search
          </button>
          <button
            type="button"
            onClick={handleNearMe}
            disabled={locating}
            className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-6 py-3.5 rounded-2xl transition-all border border-blue-200 shadow-sm"
          >
            {locating ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
            Near Me
          </button>
        </form>

        {/* City Quick Select */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">Quick Select:</span>
          <button
            onClick={() => handleCitySelect('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCity === 'All' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Cities
          </button>
          {CITIES.map(city => (
            <button
              key={city}
              onClick={() => handleCitySelect(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCity === city ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:h-[600px]">
        {/* Left: Results */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-gray-800 text-sm">
              {results.length} {results.length === 1 ? 'Booth' : 'Booths'} Found
            </h3>
            {selectedCity !== 'All' && (
              <span className="text-xs font-bold bg-white px-2 py-1 rounded-lg border text-gray-500">{selectedCity}</span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {!searched && results.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <MapPin size={48} className="mx-auto mb-3 opacity-40 text-red-300" />
                <p className="font-bold text-gray-600">Search for a location</p>
                <p className="text-sm mt-1">to find polling centers near you</p>
              </div>
            )}

            {searched && results.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Search size={48} className="mx-auto mb-3 opacity-40" />
                <p className="font-bold text-gray-600">No polling centers found</p>
                <p className="text-sm mt-1">Try a different city or pincode</p>
              </div>
            )}

            <AnimatePresence>
              {results.map((center, i) => (
                <motion.div
                  key={center.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(center)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selected?.id === center.id
                      ? 'border-red-400 bg-red-50 shadow-md ring-2 ring-red-100 ring-offset-1'
                      : 'border-transparent bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-sm'
                  }`}
                  role="button"
                  aria-label={`Select ${center.name}`}
                  aria-pressed={selected?.id === center.id}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      selected?.id === center.id ? 'bg-red-500 text-white' : 'bg-white text-gray-400 border border-gray-100'
                    }`}>
                      <MapPin size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm leading-tight mb-1 ${selected?.id === center.id ? 'text-red-900' : 'text-gray-900'}`}>
                        {center.name}
                      </p>
                      <p className="text-xs font-medium text-gray-500">{center.city} · {center.pincode}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-lg ${
                          selected?.id === center.id ? 'bg-white text-red-700 shadow-sm' : 'bg-gray-200 text-gray-600'
                        }`}>
                          Booth #{center.boothNo}
                        </span>
                        {(center as any).distance !== undefined && (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                            {((center as any).distance).toFixed(1)} km away
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Map */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex-1 relative z-0">
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
                className="w-full h-full"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 bg-[url('/stripes.svg')] text-center p-6" style={{ backgroundSize: '20px 20px' }}>
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <span className="text-5xl">🗺️</span>
                </div>
                <h3 className="font-bold text-gray-800 text-xl mb-2">Google Maps Integration Required</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">
                  Add your valid <code className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-xs font-mono">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in environment variables to enable the interactive map.
                </p>
                {selected && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 text-left w-full max-w-md shadow-lg shadow-gray-200/50">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base">{selected.name}</p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">{selected.city} · {selected.pincode}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                      <p className="text-xs font-mono text-gray-600 flex items-center justify-between">
                        <span>Lat: <strong>{selected.lat}</strong></span>
                        <span>Lng: <strong>{selected.lng}</strong></span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a href={getGoogleMapsUrl(selected)} target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition-colors shadow-sm">
                        <ExternalLink size={14} /> View Map
                      </a>
                      <a href={getDirectionsUrl(selected)} target="_blank" rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold border-2 border-red-100 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors">
                        <Navigation size={14} /> Directions
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions when center selected (visible only if Map is working) */}
          {selected && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== 'demo-maps-key' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base">{selected.name}</p>
                  <p className="text-sm text-gray-500 font-medium">Booth #{selected.boothNo} · {selected.city}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <a
                  href={getGoogleMapsUrl(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-sm font-bold bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl transition-all shadow-md"
                >
                  <ExternalLink size={16} /> Open Maps
                </a>
                <a
                  href={getDirectionsUrl(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-sm font-bold border-2 border-red-100 text-red-600 px-6 py-3 rounded-xl hover:bg-red-50 transition-colors"
                >
                  <Navigation size={16} /> Directions
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* API Warning */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-gray-500 bg-white py-2.5 px-5 rounded-full inline-flex mx-auto border border-gray-200 shadow-sm">
        <MapPin size={14} className="text-red-400" />
        <span>
          <strong>Map showing an error?</strong> Enable "Maps Embed API" in Google Cloud Console.
        </span>
      </div>

    </div>
  );
}
