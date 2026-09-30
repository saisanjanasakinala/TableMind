import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Clock,
  Users,
  ChevronLeft,
  Sparkles,
  BarChart2,
  Calendar,
  Layers,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const OwnerAnalyticsPage: React.FC = () => {
  const { selectedRestaurant, reservations, tables, navigate } = useApp();

  if (!selectedRestaurant) return null;

  const currentReservations = reservations.filter((r) => r.restaurantId === selectedRestaurant.id);
  const currentTables = tables.filter((t) => t.restaurantId === selectedRestaurant.id && t.isActive);

  // Hourly distribution
  const hourCounts: Record<string, number> = {
    '17:00': 1,
    '17:30': 3,
    '18:00': 5,
    '18:30': 8,
    '19:00': 12,
    '19:30': 14, // peak
    '20:00': 11,
    '20:30': 7,
    '21:00': 4,
    '21:30': 2,
  };

  // Day of week distribution
  const dayStats = [
    { day: 'Mon', bookings: 14, occupancy: '52%' },
    { day: 'Tue', bookings: 22, occupancy: '68%' },
    { day: 'Wed', bookings: 28, occupancy: '76%' },
    { day: 'Thu', bookings: 36, occupancy: '84%' },
    { day: 'Fri', bookings: 48, occupancy: '98%' },
    { day: 'Sat', bookings: 52, occupancy: '100%' },
    { day: 'Sun', bookings: 38, occupancy: '82%' },
  ];

  const maxHourValue = Math.max(...Object.values(hourCounts));

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('owner-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              Performance Intelligence
            </div>
            <h1 className="text-3xl font-extrabold text-white font-display">
              Reservation Analytics & Peak Hours
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Dining patterns, capacity optimization, and AI allocation metrics for {selectedRestaurant.name}.
            </p>
          </div>
        </div>

        {/* 4 Summary Highlight Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Prime Peak Hours</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 font-display">
              19:00 - 20:30
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Highest table turnover pressure
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Avg Party Size</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white font-display">
              3.4 Guests
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Predominantly 2-top and 4-top tables
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Table Efficiency Gain</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-display">
              +28% Revenue
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Zero wasted 6-tops for small groups
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Double-Booking Incidents</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white font-display">
              0 (100% Protected)
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">
              Enforced by server mutex locks
            </div>
          </div>
        </div>

        {/* Charts & Graphs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Hourly Booking Density Chart */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Hourly Reservation Density (Dinner Service)
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Visual distribution of seated parties throughout evening hours.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-semibold">
                Peak: 19:30
              </span>
            </div>

            {/* Custom Bar Graph */}
            <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-4 px-2 border-b border-stone-800">
              {Object.entries(hourCounts).map(([hour, count]) => {
                const heightPercent = Math.round((count / maxHourValue) * 100);
                const isPeak = count >= 12;

                return (
                  <div key={hour} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] text-stone-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {count}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 group-hover:brightness-125 ${
                        isPeak
                          ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-lg shadow-amber-500/20'
                          : 'bg-stone-800 hover:bg-stone-700'
                      }`}
                    />
                    <span className="text-[10px] font-mono text-stone-400 mt-1">
                      {hour}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seating Style Popularity */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-display mb-1">
                Seating Area Demand
              </h3>
              <p className="text-xs text-stone-400 mb-6">
                Customer preference distribution
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Window Skyline (Romantic)</span>
                    <span className="font-bold text-amber-400">42%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Velvet Booths</span>
                    <span className="font-bold text-amber-400">31%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '31%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Outdoor Patio</span>
                    <span className="font-bold text-amber-400">16%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '16%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Chef Counter / Bar</span>
                    <span className="font-bold text-amber-400">11%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-950 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '11%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-stone-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>TableMind pairs diners with their favorite zone automatically.</span>
            </div>
          </div>
        </div>

        {/* Weekly Day-by-Day Breakdown */}
        <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl">
          <h3 className="text-base font-bold text-white font-display mb-4">
            Weekly Booking Volume & Table Occupancy
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {dayStats.map((item) => (
              <div
                key={item.day}
                className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-center"
              >
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  {item.day}
                </div>
                <div className="text-xl font-extrabold text-white mt-2 font-display">
                  {item.bookings}
                </div>
                <div className="text-[10px] text-stone-500">Reservations</div>
                <div className="mt-2 text-xs font-bold text-emerald-400">
                  {item.occupancy} cap
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
