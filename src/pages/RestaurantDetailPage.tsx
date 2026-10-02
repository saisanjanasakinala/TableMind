import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  ChevronLeft,
  Calendar,
  Sparkles,
  UtensilsCrossed,
  Info,
  CheckCircle,
  Eye,
  Store,
  Navigation2,
} from 'lucide-react';
import { RestaurantTable, SeatingType } from '../types';
import { calculateDistanceKm, formatDistance } from '../data/mockData';

export const RestaurantDetailPage: React.FC = () => {
  const { selectedRestaurant, tables, navigate, userLocation } = useApp();

  const [activeTab, setActiveTab] = useState<'menu' | 'layout' | 'about'>('menu');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!selectedRestaurant) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-stone-400 mb-4">Restaurant not found.</p>
          <button
            onClick={() => navigate('discovery')}
            className="px-4 py-2 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs"
          >
            Back to Discovery
          </button>
        </div>
      </div>
    );
  }

  const restaurantTables = tables.filter((t) => t.restaurantId === selectedRestaurant.id && t.isActive);
  const gallery = [selectedRestaurant.heroImage, ...(selectedRestaurant.galleryImages || [])];

  const getSeatingColor = (type: SeatingType) => {
    switch (type) {
      case 'booth':
        return 'bg-purple-900/60 border-purple-500/50 text-purple-300';
      case 'window':
        return 'bg-blue-900/60 border-blue-500/50 text-blue-300';
      case 'patio':
        return 'bg-emerald-900/60 border-emerald-500/50 text-emerald-300';
      case 'bar':
        return 'bg-amber-900/60 border-amber-500/50 text-amber-300';
      case 'private':
        return 'bg-rose-900/60 border-rose-500/50 text-rose-300';
      default:
        return 'bg-stone-800 border-stone-600 text-stone-300';
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20">
      {/* Back button header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate('discovery')}
          className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white mb-4 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to all restaurants
        </button>
      </div>

      {/* Hero Visual Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Main Large Photo */}
          <div className="lg:col-span-8 h-80 sm:h-96 rounded-2xl overflow-hidden relative border border-stone-800">
            <img
              src={gallery[selectedPhotoIndex] || selectedRestaurant.heroImage}
              alt={selectedRestaurant.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-md bg-stone-900/80 backdrop-blur-md border border-stone-700 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  {selectedRestaurant.cuisine}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 font-display">
                  {selectedRestaurant.name}
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl font-normal">
                  {selectedRestaurant.tagline}
                </p>
              </div>

              <button
                onClick={() => navigate('booking', selectedRestaurant.id)}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                <Calendar className="w-4 h-4" />
                Reserve a Table
              </button>
            </div>
          </div>

          {/* Thumbnail list */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 h-80 sm:h-96">
            {gallery.slice(1, 4).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedPhotoIndex(idx + 1)}
                className={`rounded-xl overflow-hidden relative border cursor-pointer transition-all duration-200 ${
                  selectedPhotoIndex === idx + 1
                    ? 'border-amber-500 ring-2 ring-amber-500/30'
                    : 'border-stone-800 hover:border-stone-600'
                }`}
              >
                <img src={img} alt="Detail thumbnail" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Details and Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Details, Menus, Layout */}
          <div className="lg:col-span-8">
            {/* Tab navigation */}
            <div className="flex items-center gap-2 border-b border-stone-800 pb-3 mb-6">
              <button
                onClick={() => setActiveTab('menu')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === 'menu'
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'text-stone-400 hover:text-white hover:bg-stone-900'
                }`}
              >
                Menu Highlights
              </button>
              <button
                onClick={() => setActiveTab('layout')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                  activeTab === 'layout'
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'text-stone-400 hover:text-white hover:bg-stone-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                Floor Plan & Seating Layout
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === 'about'
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'text-stone-400 hover:text-white hover:bg-stone-900'
                }`}
              >
                About & Policies
              </button>
            </div>

            {/* Tab 1: Menu Highlights */}
            {activeTab === 'menu' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white font-display">
                    Signature Culinary Selections
                  </h3>
                  <span className="text-xs text-stone-400">
                    A la carte and Chef Tasting pairings available
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRestaurant.menuHighlights.map((dish, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white font-display">
                              {dish.name}
                            </span>
                            {dish.isChefSpecial && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" /> Chef Special
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider block mt-0.5">
                            {dish.category}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-amber-400 shrink-0">
                          {dish.price}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Interactive Table Layout */}
            {activeTab === 'layout' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white font-display">
                        Dining Room Floor Plan & Seating Zones
                      </h3>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Interactive preview of tables and seating styles available for booking.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-600 text-blue-300">
                        Window
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-600 text-purple-300">
                        Booth
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-600 text-emerald-300">
                        Patio
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-600 text-amber-300">
                        Bar
                      </span>
                      <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-600 text-rose-300">
                        Private
                      </span>
                    </div>
                  </div>

                  {/* Floor plan visual stage */}
                  <div className="relative w-full h-80 sm:h-96 bg-stone-950 border border-stone-800 rounded-xl overflow-hidden p-4">
                    {/* Grid texture */}
                    <div
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        backgroundImage: 'radial-gradient(circle, #78716c 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                      }}
                    />

                    {/* Entrance & Bar labels */}
                    <div className="absolute top-2 left-4 text-[10px] font-mono text-stone-500 uppercase">
                      [ Front Entrance & Host Stand ]
                    </div>
                    <div className="absolute top-2 right-4 text-[10px] font-mono text-stone-500 uppercase">
                      [ Kitchen & Cellar ]
                    </div>

                    {/* Table Markers */}
                    {restaurantTables.map((tab) => {
                      const colorClass = getSeatingColor(tab.seatingType);
                      return (
                        <div
                          key={tab.id}
                          style={{
                            left: `${tab.posX}%`,
                            top: `${tab.posY}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                          className={`absolute p-2 rounded-xl border flex flex-col items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer ${colorClass} ${
                            tab.shape === 'round' ? 'w-14 h-14 rounded-full' : 'w-16 h-12 rounded-lg'
                          }`}
                        >
                          <span className="text-[11px] font-bold font-mono leading-none">
                            {tab.tableNumber}
                          </span>
                          <span className="text-[9px] opacity-80 mt-0.5 leading-none">
                            {tab.capacity}p
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-stone-400">
                    <div>
                      Total Capacity: <span className="text-white font-semibold">{restaurantTables.reduce((acc, t) => acc + t.capacity, 0)} guests</span> across {restaurantTables.length} tables
                    </div>
                    <button
                      onClick={() => navigate('booking', selectedRestaurant.id)}
                      className="text-amber-400 font-semibold hover:underline"
                    >
                      Book a table in this layout →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: About & Policies */}
            {activeTab === 'about' && (
              <div className="space-y-4 text-xs text-stone-300 leading-relaxed bg-stone-900 border border-stone-800 p-6 rounded-2xl">
                <h3 className="text-base font-bold text-white font-display mb-2">
                  Atmosphere & Dining Guidelines
                </h3>
                <p>{selectedRestaurant.description}</p>
                <div className="mt-4 pt-4 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-1">Reservation Policy</h4>
                    <p className="text-stone-400">
                      Standard dining duration is 90 minutes. Tables are held for up to 15 minutes past the reserved time.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Dietary & Allergies</h4>
                    <p className="text-stone-400">
                      Our culinary team accommodates vegetarian, vegan, and gluten-free preferences upon request during booking.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Restaurant Info Card & Quick Reserve */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-white">{selectedRestaurant.rating}</span>
                  <span className="text-stone-400 font-normal">
                    ({selectedRestaurant.reviewCount} verified reviews)
                  </span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  {selectedRestaurant.priceRange}
                </span>
              </div>

              <div className="space-y-3.5 text-xs text-stone-300 py-3 border-y border-stone-800">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-white">{selectedRestaurant.address}</div>
                    <div className="text-[11px] text-stone-400">
                      {selectedRestaurant.neighborhood}, {selectedRestaurant.city}
                    </div>
                    {userLocation && selectedRestaurant.latitude !== undefined && selectedRestaurant.longitude !== undefined && (
                      <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                        <Navigation2 className="w-2.5 h-2.5 rotate-45 fill-amber-300" />
                        {formatDistance(
                          calculateDistanceKm(
                            userLocation.latitude,
                            userLocation.longitude,
                            selectedRestaurant.latitude,
                            selectedRestaurant.longitude
                          )
                        )} from {userLocation.label.split(',')[0]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-white">
                      {selectedRestaurant.openingHours.open} - {selectedRestaurant.openingHours.close}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {selectedRestaurant.openingHours.days}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                  <span>{selectedRestaurant.phone}</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-stone-500 shrink-0" />
                  <span>{selectedRestaurant.email}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate('booking', selectedRestaurant.id)}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4" />
                  Reserve a Table Now
                </button>

                <button
                  onClick={() => navigate('ai-assistant')}
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-700 hover:border-amber-500/50 text-stone-300 hover:text-white font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Ask AI for Best Table Slot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
