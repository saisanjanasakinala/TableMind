import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Calendar,
  Utensils,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { getTodayDateString } from '../data/mockData';
import { Restaurant, SeatingType } from '../types';

export const DiscoveryPage: React.FC = () => {
  const { restaurants, tables, reservations, navigate, isTableFree } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [selectedPrice, setSelectedPrice] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedTime, setSelectedTime] = useState<string>('19:00');
  const [partySize, setPartySize] = useState<number>(2);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'priceAsc' | 'priceDesc' | 'tables'>('rating');

  // Extract unique cuisines
  const cuisines = useMemo(() => {
    const list = new Set(restaurants.map((r) => r.cuisine));
    return ['All', ...Array.from(list)];
  }, [restaurants]);

  // Compute live availability per restaurant for the selected date, time & party size
  const restaurantAvailability = useMemo(() => {
    const availabilityMap: Record<string, { availableCount: number; totalTables: number }> = {};

    restaurants.forEach((r) => {
      const restTables = tables.filter((t) => t.restaurantId === r.id && t.isActive);
      const eligibleTables = restTables.filter((t) => t.capacity >= partySize);
      const available = eligibleTables.filter((t) => isTableFree(t.id, selectedDate, selectedTime));

      availabilityMap[r.id] = {
        availableCount: available.length,
        totalTables: restTables.length,
      };
    });

    return availabilityMap;
  }, [restaurants, tables, reservations, selectedDate, selectedTime, partySize, isTableFree]);

  // Filter and sort restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((r) => {
        // Text match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = r.name.toLowerCase().includes(q);
          const matchCuisine = r.cuisine.toLowerCase().includes(q);
          const matchNeighborhood = r.neighborhood.toLowerCase().includes(q);
          const matchCity = r.city.toLowerCase().includes(q);
          if (!matchName && !matchCuisine && !matchNeighborhood && !matchCity) return false;
        }

        // Cuisine
        if (selectedCuisine !== 'All' && r.cuisine !== selectedCuisine) return false;

        // Price
        if (selectedPrice !== 'All' && r.priceRange !== selectedPrice) return false;

        // Rating
        if (minRating > 0 && r.rating < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
        if (sortBy === 'priceAsc') return a.priceRange.length - b.priceRange.length;
        if (sortBy === 'priceDesc') return b.priceRange.length - a.priceRange.length;
        if (sortBy === 'tables') {
          const availA = restaurantAvailability[a.id]?.availableCount || 0;
          const availB = restaurantAvailability[b.id]?.availableCount || 0;
          return availB - availA;
        }
        return 0;
      });
  }, [restaurants, searchQuery, selectedCuisine, selectedPrice, minRating, sortBy, restaurantAvailability]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Utensils className="w-3.5 h-3.5" /> Real-Time Table Inventory
              </div>
              <h1 className="text-3xl font-extrabold text-white font-display">
                Discover & Book Restaurants
              </h1>
              <p className="text-xs text-stone-400 mt-1">
                Verified table availability updated with atomic server concurrency.
              </p>
            </div>

            {/* Quick AI Trigger */}
            <button
              onClick={() => navigate('ai-assistant')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Book with AI Assistant
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 mb-8 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurant, cuisine, or neighborhood..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Date */}
            <div className="lg:col-span-3 relative">
              <Calendar className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                min={getTodayDateString()}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-2 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Time */}
            <div className="lg:col-span-2 relative">
              <Clock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-8 pr-2 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'].map(
                  (t) => (
                    <option key={t} value={t} className="bg-stone-900 text-white">
                      {t}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Guests */}
            <div className="lg:col-span-3 relative">
              <Users className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-8 pr-2 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                  <option key={n} value={n} className="bg-stone-900 text-white">
                    {n} {n === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary Filter Tags */}
          <div className="mt-4 pt-4 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Cuisine Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-stone-400 font-semibold mr-1">Cuisine:</span>
              {cuisines.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCuisine(c)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedCuisine === c
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Price & Rating Controls */}
            <div className="flex items-center gap-3">
              {/* Price Filter */}
              <div className="flex items-center gap-1">
                <span className="text-stone-400 font-semibold">Price:</span>
                {['All', '$', '$$', '$$$', '$$$$'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPrice(p)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                      selectedPrice === p
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400 font-semibold">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-stone-950 border border-stone-800 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Popular</option>
                  <option value="tables">Available Tables</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-5 text-xs text-stone-400">
          <div>
            Showing <span className="text-white font-semibold">{filteredRestaurants.length}</span> restaurants
            for party of <span className="text-amber-400 font-semibold">{partySize}</span> on{' '}
            <span className="text-white font-semibold">{selectedDate}</span> at{' '}
            <span className="text-white font-semibold">{selectedTime}</span>
          </div>
        </div>

        {/* Restaurant Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="p-12 text-center bg-stone-900 border border-stone-800 rounded-2xl">
            <Utensils className="w-10 h-10 text-stone-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white font-display">No restaurants matched your filters</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              Try adjusting your cuisine, search keywords, or selecting a different date/time.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCuisine('All');
                setSelectedPrice('All');
                setMinRating(0);
              }}
              className="mt-4 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-white rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => {
              const availability = restaurantAvailability[restaurant.id] || {
                availableCount: 0,
                totalTables: 0,
              };
              const hasTables = availability.availableCount > 0;

              return (
                <div
                  key={restaurant.id}
                  className="bg-stone-900 border border-stone-800 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/70 flex flex-col group"
                >
                  {/* Image & Overlay Badges */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={restaurant.heroImage}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-stone-900/80 backdrop-blur-md border border-stone-700 text-xs font-semibold text-amber-400 flex items-center gap-1 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{restaurant.rating}</span>
                      <span className="text-stone-400 font-normal">({restaurant.reviewCount})</span>
                    </div>

                    {/* Price and Cuisine */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-stone-900/80 border border-stone-700 font-semibold text-white">
                        {restaurant.cuisine}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                        {restaurant.priceRange}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors font-display">
                        {restaurant.name}
                      </h2>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                        {restaurant.description}
                      </p>

                      <div className="mt-3 flex items-center gap-1.5 text-xs text-stone-400">
                        <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span className="truncate">{restaurant.address}, {restaurant.neighborhood}</span>
                      </div>

                      {/* Menu Highlight Snippet */}
                      {restaurant.menuHighlights[0] && (
                        <div className="mt-3 p-2.5 rounded-xl bg-stone-950/80 border border-stone-800/80 text-[11px]">
                          <div className="text-stone-400 flex items-center justify-between">
                            <span className="font-semibold text-stone-300 truncate">
                              Signature: {restaurant.menuHighlights[0].name}
                            </span>
                            <span className="text-amber-400 font-medium">
                              {restaurant.menuHighlights[0].price}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Real-time Availability & Booking CTA */}
                    <div className="mt-5 pt-4 border-t border-stone-800">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          {hasTables ? (
                            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {availability.availableCount} tables open
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-400 font-semibold">
                              <Clock className="w-3.5 h-3.5" />
                              Fully Booked (Waitlist)
                            </span>
                          )}
                        </div>
                        <span className="text-stone-400 text-[11px]">
                          at {selectedTime}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => navigate('restaurant-detail', restaurant.id)}
                          className="w-full py-2 px-3 rounded-xl border border-stone-700 hover:border-stone-500 text-xs font-semibold text-stone-200 hover:text-white transition-colors cursor-pointer text-center"
                        >
                          View Menu & Layout
                        </button>
                        <button
                          onClick={() => navigate('booking', restaurant.id)}
                          className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer text-center"
                        >
                          {hasTables ? 'Select Table' : 'Check Times'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
