import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Navigation,
  MapPin,
  Search,
  Building2,
  AlertTriangle,
  Loader2,
  X,
  Compass,
  Check,
  ChevronDown,
} from 'lucide-react';
import { PRESET_LOCATIONS, calculateDistanceKm } from '../data/mockData';
import { UserLocation } from '../types';

interface LocationSelectorProps {
  onLocationChange?: (location: UserLocation | null) => void;
  compact?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationChange, compact = false }) => {
  const { userLocation, setUserLocation, searchRadiusKm, setSearchRadiusKm, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'current' | 'manual' | 'preset' | null>(null);
  const [manualQuery, setManualQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter preset locations based on manual search query
  const filteredPresets = PRESET_LOCATIONS.filter((loc) => {
    if (!manualQuery.trim()) return true;
    const q = manualQuery.toLowerCase();
    return (
      loc.name.toLowerCase().includes(q) ||
      loc.area.toLowerCase().includes(q) ||
      loc.city.toLowerCase().includes(q) ||
      loc.state.toLowerCase().includes(q) ||
      loc.popularCuisines.some((c) => c.toLowerCase().includes(q))
    );
  });

  // Handler: Use My Current Location
  const handleUseCurrentLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      const err = 'Geolocation is not supported by your current browser.';
      setLocationError(err);
      showToast(err, 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIsLocating(false);

        // Find nearest known preset area for a friendly label
        let nearestPreset = PRESET_LOCATIONS[0];
        let minDistance = Infinity;

        PRESET_LOCATIONS.forEach((preset) => {
          const dist = calculateDistanceKm(latitude, longitude, preset.latitude, preset.longitude);
          if (dist < minDistance) {
            minDistance = dist;
            nearestPreset = preset;
          }
        });

        // If within 40km of a known city/area, give it a recognizable friendly label
        let label = 'Current Location';
        let city = undefined;
        let area = undefined;

        if (minDistance <= 40) {
          label = `Current Location (${nearestPreset.city})`;
          city = nearestPreset.city;
          area = nearestPreset.area;
        } else {
          label = `Current Location (${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°)`;
        }

        const newLoc: UserLocation = {
          label,
          mode: 'current',
          latitude,
          longitude,
          city,
          area,
        };

        setUserLocation(newLoc);
        onLocationChange?.(newLoc);
        showToast(`Location set to ${label}`, 'success');
        setIsDropdownOpen(false);
        setActiveTab(null);
      },
      (error) => {
        setIsLocating(false);
        let errorMsg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. Please allow location access in your browser settings or select a city manually below.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information is temporarily unavailable. Please select your city/area manually.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'The request to get your location timed out. Please try again or select a city.';
        }
        setLocationError(errorMsg);
        showToast(errorMsg, 'error');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Handler: Select Preset
  const handleSelectPreset = (preset: (typeof PRESET_LOCATIONS)[0]) => {
    const newLoc: UserLocation = {
      label: `${preset.name}, ${preset.state}`,
      mode: 'preset',
      latitude: preset.latitude,
      longitude: preset.longitude,
      city: preset.city,
      area: preset.area,
      state: preset.state,
    };
    setUserLocation(newLoc);
    onLocationChange?.(newLoc);
    showToast(`Location set to ${preset.name}, ${preset.state}`, 'success');
    setIsDropdownOpen(false);
    setActiveTab(null);
    setLocationError(null);
  };

  // Handler: Custom Manual Location submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;

    // Check if query matches any presets first
    const matched = PRESET_LOCATIONS.find(
      (p) =>
        p.name.toLowerCase().includes(manualQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(manualQuery.toLowerCase()) ||
        p.area.toLowerCase().includes(manualQuery.toLowerCase())
    );

    if (matched) {
      handleSelectPreset(matched);
      setManualQuery('');
      return;
    }

    // Resolve coordinates and structured fields for manual location
    let customLat = 17.4435;
    let customLng = 78.3772;
    let normalizedCity = manualQuery.trim();
    let normalizedArea = '';
    let normalizedState = '';
    const lower = manualQuery.toLowerCase();

    if (
      lower.includes('hyderabad') ||
      lower.includes('hitec') ||
      lower.includes('banjara') ||
      lower.includes('jubilee') ||
      lower.includes('gandipet') ||
      lower.includes('madhapur')
    ) {
      customLat = 17.4435;
      customLng = 78.3772;
      normalizedCity = 'Hyderabad';
      normalizedArea = 'Hitec City & Banjara Hills';
      normalizedState = 'Telangana';
    } else if (
      lower.includes('surampalem') ||
      lower.includes('aditya') ||
      lower.includes('adb')
    ) {
      customLat = 17.0863;
      customLng = 82.0620;
      normalizedCity = 'Surampalem';
      normalizedArea = 'Aditya Educational City / ADB Road';
      normalizedState = 'Andhra Pradesh';
    } else if (lower.includes('kakinada') || lower.includes('bhanugudi')) {
      customLat = 16.9891;
      customLng = 82.2475;
      normalizedCity = 'Kakinada';
      normalizedArea = 'Bhanugudi Junction & Coastal Road';
      normalizedState = 'Andhra Pradesh';
    } else if (lower.includes('rajahmundry') || lower.includes('godavari')) {
      customLat = 17.0005;
      customLng = 81.8040;
      normalizedCity = 'Rajahmundry';
      normalizedArea = 'Godavari Riverfront';
      normalizedState = 'Andhra Pradesh';
    } else if (
      lower.includes('francisco') ||
      lower.includes('sf') ||
      lower.includes('downtown') ||
      lower.includes('soma') ||
      lower.includes('mission')
    ) {
      customLat = 37.7915;
      customLng = -122.4010;
      normalizedCity = 'San Francisco';
      normalizedArea = 'Downtown Financial District';
      normalizedState = 'California';
    }

    const newLoc: UserLocation = {
      label: normalizedState
        ? `${normalizedCity}, ${normalizedState}`
        : manualQuery.trim(),
      mode: 'manual',
      latitude: customLat,
      longitude: customLng,
      city: normalizedCity,
      area: normalizedArea,
      state: normalizedState,
    };

    setUserLocation(newLoc);
    onLocationChange?.(newLoc);
    showToast(`Location set to ${newLoc.label}`, 'success');
    setManualQuery('');
    setIsDropdownOpen(false);
    setActiveTab(null);
    setLocationError(null);
  };

  // Clear Location
  const handleClearLocation = () => {
    setUserLocation(null);
    onLocationChange?.(null);
    showToast('Location filter cleared (showing all restaurants)', 'info');
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full">
      {/* Location Selector Bar */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-3 sm:p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Active Location Display & Dropdown Trigger */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>Selected Dining Location</span>
                {userLocation && (
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  {userLocation ? userLocation.label : 'All Locations (Worldwide)'}
                </span>
                {userLocation && (
                  <button
                    onClick={handleClearLocation}
                    title="Clear location filter"
                    className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Use My Current Location Button */}
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                userLocation?.mode === 'current'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 hover:border-amber-500/30'
              }`}
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>{isLocating ? 'Detecting...' : 'Use My Current Location'}</span>
            </button>

            {/* 2. Manual / Area Dropdown Toggle */}
            <button
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                if (!isDropdownOpen) setActiveTab('preset');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 hover:border-amber-500/30 transition-all cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Area / Search</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Search Radius Pills (if location is set) */}
            {userLocation && (
              <div className="flex items-center gap-1 bg-stone-950/80 border border-stone-800 rounded-xl p-1 text-[11px]">
                <span className="text-stone-400 font-medium px-1.5 hidden md:inline">Radius:</span>
                {[5, 15, 25, 50, 0].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSearchRadiusKm(r)}
                    className={`px-2 py-0.5 rounded-lg font-medium transition-colors cursor-pointer ${
                      searchRadiusKm === r
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    {r === 0 ? 'All' : `${r}km`}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Alert Box */}
        {locationError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-rose-200">Location Access Issue</p>
              <p className="mt-0.5 text-stone-300 leading-relaxed">{locationError}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(true);
                    setActiveTab('preset');
                    setLocationError(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Select City / Area Instead →
                </button>
                <button
                  onClick={() => setLocationError(null)}
                  className="px-2.5 py-1 rounded-lg text-stone-400 hover:text-stone-200 text-[11px] transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => setLocationError(null)}
              className="text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Expandable Location Modal / Panel */}
        {isDropdownOpen && (
          <div className="mt-4 pt-4 border-t border-stone-800 animate-in fade-in slide-in-from-top-2">
            {/* Tabs for Location Selection */}
            <div className="flex items-center gap-2 border-b border-stone-800/80 pb-3 mb-4">
              <button
                onClick={() => setActiveTab('preset')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === 'preset'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-200 bg-stone-800/50'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Select City / Area
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === 'manual'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-200 bg-stone-800/50'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                Search Location Manually
              </button>
            </div>

            {/* TAB 1: Select City / Area Grid */}
            {activeTab === 'preset' && (
              <div>
                <p className="text-xs text-stone-400 mb-3">
                  Choose from popular curated dining hubs. Restaurants and tables will dynamically re-sort by proximity:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {PRESET_LOCATIONS.map((preset) => {
                    const isSelected =
                      userLocation?.mode === 'preset' && userLocation.city === preset.city && userLocation.area === preset.area;

                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                            : 'bg-stone-950/60 border-stone-800 hover:border-amber-500/40 hover:bg-stone-950 text-stone-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white">{preset.name}</span>
                            {preset.name.includes('Surampalem') && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                                Highlighted
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">{preset.area}</p>
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-stone-500">
                            <span className="text-amber-400 font-semibold">{preset.restaurantCount} Restaurants</span>
                            <span>•</span>
                            <span className="truncate max-w-[140px]">{preset.popularCuisines.join(', ')}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 ml-2">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Search Location Manually */}
            {activeTab === 'manual' && (
              <div>
                <form onSubmit={handleManualSubmit} className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={manualQuery}
                      onChange={(e) => setManualQuery(e.target.value)}
                      placeholder="Type a city, area, campus (e.g. Surampalem, Kakinada, San Francisco, Mission)..."
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    Apply Location
                  </button>
                </form>

                {/* Instant Matches Suggestions */}
                {filteredPresets.length > 0 && (
                  <div>
                    <span className="text-[11px] text-stone-400 font-semibold">Suggested Matching Areas:</span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {filteredPresets.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleSelectPreset(p)}
                          className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs border border-stone-700/80 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{p.name}</span>
                          <span className="text-stone-400 text-[10px]">({p.city})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
