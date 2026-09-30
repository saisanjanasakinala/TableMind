import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Store,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { getTodayDateString } from '../data/mockData';
import { ReservationStatus } from '../types';

export const OwnerDashboardPage: React.FC = () => {
  const {
    selectedRestaurant,
    restaurants,
    setSelectedRestaurantId,
    tables,
    reservations,
    updateReservationStatus,
    navigate,
  } = useApp();

  const today = getTodayDateString();

  // Tables for active restaurant
  const currentTables = useMemo(
    () => tables.filter((t) => t.restaurantId === selectedRestaurant?.id),
    [tables, selectedRestaurant?.id]
  );

  // Today's reservations for active restaurant
  const todayReservations = useMemo(
    () =>
      reservations.filter(
        (r) => r.restaurantId === selectedRestaurant?.id && r.date === today
      ),
    [reservations, selectedRestaurant?.id, today]
  );

  const totalBookingsToday = todayReservations.length;
  const activeBookings = todayReservations.filter(
    (r) => r.status === 'confirmed' || r.status === 'seated'
  );
  const seatedBookings = todayReservations.filter((r) => r.status === 'seated');
  const cancelledBookings = todayReservations.filter((r) => r.status === 'cancelled');

  const totalCapacity = currentTables.reduce((acc, t) => acc + (t.isActive ? t.capacity : 0), 0);
  const expectedGuests = activeBookings.reduce((acc, r) => acc + r.guestCount, 0);
  const occupancyRate = totalCapacity > 0 ? Math.min(100, Math.round((expectedGuests / totalCapacity) * 100)) : 0;

  const availableTablesCount = currentTables.filter((t) => t.isActive).length - seatedBookings.length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Restaurant Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" /> Restaurant Operator Portal
            </div>
            <h1 className="text-3xl font-extrabold text-white font-display">
              {selectedRestaurant?.name || 'Restaurant Management'}
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Live operational control, table allocation, and daily schedule for {today}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Restaurant Selector */}
            <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-xl px-3 py-1.5">
              <span className="text-xs text-stone-400">Managing:</span>
              <select
                value={selectedRestaurant?.id}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id} className="bg-stone-900 text-white">
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => navigate('owner-tables')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Store className="w-4 h-4" /> Live Floor Plan
            </button>
          </div>
        </div>

        {/* 4 Core Operational KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Metric 1 */}
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Today's Total Bookings</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white font-display">
              {totalBookingsToday}
            </div>
            <div className="mt-2 text-[11px] text-stone-400">
              <span className="text-emerald-400 font-semibold">{expectedGuests} guests</span> expected today
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Currently Seated</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-400 font-display">
              {seatedBookings.length} Tables
            </div>
            <div className="mt-2 text-[11px] text-stone-400">
              {availableTablesCount} tables currently open
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Occupancy Rate</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white font-display">
              {occupancyRate}%
            </div>
            <div className="mt-2 text-[11px] text-stone-400">
              Optimal capacity utilization
            </div>
          </div>

          {/* Metric 4 */}
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
            <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
              <span>Cancelled Bookings</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl font-bold text-stone-300 font-display">
              {cancelledBookings.length}
            </div>
            <div className="mt-2 text-[11px] text-emerald-400">
              Tables auto-released immediately
            </div>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('owner-tables')}
            className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Floor Plan & Table Setup</h3>
            <p className="text-xs text-stone-400 mt-1">
              Add tables, configure capacities, toggle maintenance status, and view visual map.
            </p>
          </button>

          <button
            onClick={() => navigate('owner-reservations')}
            className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Reservations Management</h3>
            <p className="text-xs text-stone-400 mt-1">
              Check in diners, seat guests, edit reservation details, and view customer requests.
            </p>
          </button>

          <button
            onClick={() => navigate('owner-analytics')}
            className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <h3 className="text-base font-bold text-white font-display">Occupancy & Peak Hours</h3>
            <p className="text-xs text-stone-400 mt-1">
              Inspect dining heatmaps, turnover rates, party size distribution, and revenue trends.
            </p>
          </button>
        </div>

        {/* Today's Schedule Table */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Today's Guest Schedule
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Real-time booking registry for {today}
              </p>
            </div>
            <button
              onClick={() => navigate('owner-reservations')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              View Full List <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {todayReservations.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              No reservations recorded for today yet.
            </div>
          ) : (
            <div className="divide-y divide-stone-800">
              {todayReservations.map((res) => (
                <div
                  key={res.id}
                  className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-800/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-stone-950 border border-stone-800 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {res.time}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {res.customerName}
                        </span>
                        <span className="text-xs font-mono text-stone-400">
                          ({res.reservationCode})
                        </span>
                        {res.aiAssisted && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> AI
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-stone-400 mt-0.5 flex items-center gap-3">
                        <span className="font-mono font-semibold text-white">
                          Table {res.tableNumber}
                        </span>
                        <span>•</span>
                        <span>{res.guestCount} Guests</span>
                        <span>•</span>
                        <span>{res.customerPhone}</span>
                      </div>

                      {res.specialRequests && (
                        <div className="text-[11px] text-amber-300/80 italic mt-1">
                          “{res.specialRequests}”
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Operational Status Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                        res.status === 'confirmed'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : res.status === 'seated'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : res.status === 'completed'
                          ? 'bg-stone-800 text-stone-400'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {res.status}
                    </span>

                    {res.status === 'confirmed' && (
                      <button
                        onClick={() => updateReservationStatus(res.id, 'seated')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        Seat Guest
                      </button>
                    )}

                    {res.status === 'seated' && (
                      <button
                        onClick={() => updateReservationStatus(res.id, 'completed')}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        Finish Dining
                      </button>
                    )}

                    {res.status !== 'cancelled' && res.status !== 'completed' && (
                      <button
                        onClick={() => updateReservationStatus(res.id, 'cancelled')}
                        className="px-2.5 py-1.5 rounded-lg border border-rose-900/60 hover:bg-rose-950/40 text-rose-300 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
