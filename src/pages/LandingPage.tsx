import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Search,
  Users,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  MapPin,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  CheckCircle,
  Compass,
} from 'lucide-react';
import { getTodayDateString, getTomorrowDateString, filterRestaurantByLocation } from '../data/mockData';
import { LocationSelector } from '../components/LocationSelector';
import { FindTablesFlowBar } from '../components/FindTablesFlowBar';

export const LandingPage: React.FC = () => {
  const {
    restaurants,
    tables,
    reservations,
    navigate,
    userLocation,
    searchRadiusKm,
    bookingDate,
    setBookingDate,
    bookingTime,
    setBookingTime,
    bookingPartySize,
    setBookingPartySize,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const displayedLocationRestaurants = useMemo(() => {
    if (userLocation) {
      const matched = restaurants.filter((r) =>
        filterRestaurantByLocation(r, userLocation, searchRadiusKm)
      );
      if (matched.length > 0) return matched;
    }
    return restaurants;
  }, [restaurants, userLocation, searchRadiusKm]);

  const featuredRestaurants = useMemo(() => {
    return displayedLocationRestaurants.slice(0, 3);
  }, [displayedLocationRestaurants]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('discovery');
  };

  const handleAskAIExample = (prompt: string) => {
    navigate('ai-assistant');
  };

  // Platform metrics
  const activeTablesCount = tables.filter((t) => t.isActive).length;
  const confirmedBookingsCount = reservations.filter((r) => r.status !== 'cancelled').length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 border-b border-stone-800/80">
        {/* Ambient atmospheric glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Location-Aware Restaurant Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-display">
              Smart Table Reservations,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-orange-400">
                Anywhere You Are.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-stone-300 leading-relaxed font-normal">
              Find restaurants near your current location, discover live table capacity, conversational AI concierge booking, and guaranteed zero double bookings.
            </p>

            {/* AI Assistant Quick Prompt Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-stone-400">
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <Sparkles className="w-3 h-3" /> Try AI Concierge prompt:
              </span>
              <button
                onClick={() => handleAskAIExample("Find a table for 4 people tomorrow at 7 PM near Surampalem.")}
                className="px-3 py-1 rounded-full bg-stone-900 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer font-medium"
              >
                “Table for 4 tomorrow at 7 PM near Surampalem” →
              </button>
              <button
                onClick={() => handleAskAIExample("Find a romantic booth for 2 tonight near Downtown San Francisco")}
                className="px-3 py-1 rounded-full bg-stone-900 border border-stone-800 hover:border-amber-500/50 hover:text-amber-300 transition-colors cursor-pointer"
              >
                “Booth for 2 tonight near Downtown SF” →
              </button>
            </div>
          </div>

          {/* Guided Find Tables Flow Progress Bar */}
          <div className="max-w-4xl mx-auto mb-4">
            <FindTablesFlowBar currentStep="location" />
          </div>

          {/* Location Selector Component near search bar */}
          <div className="max-w-4xl mx-auto mb-4">
            <LocationSelector />
          </div>

          {/* Core Search & Booking Bar */}
          <div className="max-w-4xl mx-auto bg-stone-900/90 border border-stone-800 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/80 backdrop-blur-md">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              {/* Restaurant / Cuisine Search */}
              <div className="lg:col-span-4 relative">
                <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1 pl-1">
                  Restaurant or Cuisine
                </label>
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Coastal Andhra, French, Omakase..."
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1 pl-1">
                  Date
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                  <input
                    type="date"
                    value={bookingDate}
                    min={getTodayDateString()}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-1 pl-1">
                  Party Size
                </label>
                <div className="relative flex items-center">
                  <Users className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
                  <select
                    value={bookingPartySize}
                    onChange={(e) => setBookingPartySize(Number(e.target.value))}
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
                      <option key={n} value={n} className="bg-stone-900 text-white">
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="lg:col-span-3 self-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Search className="w-4 h-4" />
                  Find Tables Nearby
                </button>
              </div>
            </form>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 text-center">
              <div className="text-2xl font-bold text-amber-400 font-display">0.0%</div>
              <div className="text-xs text-stone-400 mt-0.5">Double Booking Rate</div>
              <div className="text-[10px] text-emerald-400 mt-1 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Server Lock Protected
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 text-center">
              <div className="text-2xl font-bold text-white font-display">94%</div>
              <div className="text-xs text-stone-400 mt-0.5">Capacity Efficiency</div>
              <div className="text-[10px] text-stone-400 mt-1">Smart Table Allocation</div>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 text-center">
              <div className="text-2xl font-bold text-white font-display">
                {confirmedBookingsCount} Active
              </div>
              <div className="text-xs text-stone-400 mt-0.5">Reservations Tracked</div>
              <div className="text-[10px] text-stone-400 mt-1">Real-time Table States</div>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800/80 text-center">
              <div className="text-2xl font-bold text-white font-display">~18 mins</div>
              <div className="text-xs text-stone-400 mt-0.5">Wait Time Reduced</div>
              <div className="text-[10px] text-amber-400 mt-1 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" /> Predictive Turnover
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              Top Curated Culinary Destinations
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {userLocation ? `Restaurants near ${userLocation.label}` : 'Featured Partner Restaurants'}
            </h2>
          </div>
          <button
            onClick={() => navigate('discovery')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            Explore all {displayedLocationRestaurants.length} restaurants {userLocation ? `near ${userLocation.label}` : ''} <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRestaurants.map((restaurant) => {
            const restTables = tables.filter((t) => t.restaurantId === restaurant.id && t.isActive);
            return (
              <div
                key={restaurant.id}
                className="group bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/60 flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.heroImage}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-stone-900/80 backdrop-blur-md border border-stone-700 text-xs font-semibold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{restaurant.rating}</span>
                    <span className="text-stone-400 font-normal">({restaurant.reviewCount})</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-stone-200">
                    <span className="font-semibold text-white">{restaurant.cuisine}</span>
                    <span className="text-amber-400 font-semibold">{restaurant.priceRange}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors font-display">
                      {restaurant.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {restaurant.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-stone-400">
                      <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                      <span className="truncate">{restaurant.neighborhood}, {restaurant.city}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-800 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-stone-400">
                      <span className="text-emerald-400 font-semibold">{restTables.length} tables</span> on floor
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate('restaurant-detail', restaurant.id)}
                        className="px-3 py-1.5 text-xs text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => navigate('booking', restaurant.id)}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer transition-all hover:scale-105"
                      >
                        Book Table
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-20 bg-stone-900/60 border-y border-stone-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Three Pillars of TableMind AI
            </div>
            <h2 className="text-3xl font-bold text-white font-display">
              Intelligent Hospitality at Every Step
            </h2>
            <p className="mt-3 text-sm text-stone-400 leading-relaxed">
              Built from the ground up to prevent the common frustrations of online dining bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl relative group hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display mb-2">
                Conversational AI Concierge
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                Diners speak in natural human terms: “Find a romantic booth for 2 at 8 PM.” TableMind extracts
                guest count, date, time, and preferences, and checks real-time database availability before suggesting any table.
              </p>
              <ul className="text-xs text-stone-300 space-y-1.5">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Real-time database validation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Instant one-click in-chat booking
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl relative group hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display mb-2">
                Smart Table Allocation
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                Protects restaurant revenue by avoiding wasting 6-top or 8-top tables for small parties of 2
                when 2-tops are available. Automatically pairs guests with their preferred seating type.
              </p>
              <ul className="text-xs text-stone-300 space-y-1.5">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Anti-waste seat capacity scoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Booth, window & patio preference matching
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl relative group hover:border-amber-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white font-display mb-2">
                Predictive Wait Times
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                When a table is temporarily booked, TableMind calculates dining duration turnover
                and shows the exact estimated wait time along with alternative open slots (+30m, +60m).
              </p>
              <ul className="text-xs text-stone-300 space-y-1.5">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Dynamic turnover estimation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Suggested adjacent time alternatives
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Operator vs Customer Dual View Callout */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Diner side */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              For Diners & Food Enthusiasts
            </div>
            <h3 className="text-2xl font-bold text-white font-display mb-3">
              Stress-Free Reservation Guarantee
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-6">
              Never get turned away at the door. Enjoy transparent table availability, digital confirmation tickets with QR codes, and seamless re-scheduling.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('discovery')}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Browse Restaurants
              </button>
              <button
                onClick={() => navigate('ai-assistant')}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs rounded-xl cursor-pointer transition-colors"
              >
                Try AI Assistant
              </button>
            </div>
          </div>

          {/* Owner side */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              For Restaurateurs & Hosts
            </div>
            <h3 className="text-2xl font-bold text-white font-display mb-3">
              Visual Floor Plan & Live Table Control
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-6">
              Track seating status in real-time on an interactive restaurant layout. Add and disable tables, approve walk-ins, and inspect peak-hour analytics.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('owner-dashboard')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Open Owner Dashboard
              </button>
              <button
                onClick={() => navigate('owner-tables')}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs rounded-xl cursor-pointer transition-colors"
              >
                View Floor Plan Canvas
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
