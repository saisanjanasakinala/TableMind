import React, { useMemo, useState } from 'react';
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
  Sliders,
  Settings,
  X,
  Save,
  MapPin,
  Phone,
  Mail,
  Utensils,
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
    updateRestaurant,
    navigate,
    showToast,
  } = useApp();

  const today = getTodayDateString();

  // Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsName, setSettingsName] = useState(selectedRestaurant?.name || '');
  const [settingsTagline, setSettingsTagline] = useState(selectedRestaurant?.tagline || '');
  const [settingsCuisine, setSettingsCuisine] = useState(selectedRestaurant?.cuisine || '');
  const [settingsPrice, setSettingsPrice] = useState(selectedRestaurant?.priceRange || '$$$');
  const [settingsAddress, setSettingsAddress] = useState(selectedRestaurant?.address || '');
  const [settingsArea, setSettingsArea] = useState(selectedRestaurant?.area || '');
  const [settingsCity, setSettingsCity] = useState(selectedRestaurant?.city || '');
  const [settingsPhone, setSettingsPhone] = useState(selectedRestaurant?.phone || '');
  const [settingsEmail, setSettingsEmail] = useState(selectedRestaurant?.email || '');
  const [settingsOpenTime, setSettingsOpenTime] = useState(selectedRestaurant?.openingHours.open || '17:00');
  const [settingsCloseTime, setSettingsCloseTime] = useState(selectedRestaurant?.openingHours.close || '23:00');
  const [settingsDays, setSettingsDays] = useState(selectedRestaurant?.openingHours.days || 'Tuesday - Sunday');

  const handleOpenSettings = () => {
    if (!selectedRestaurant) return;
    setSettingsName(selectedRestaurant.name);
    setSettingsTagline(selectedRestaurant.tagline);
    setSettingsCuisine(selectedRestaurant.cuisine);
    setSettingsPrice(selectedRestaurant.priceRange);
    setSettingsAddress(selectedRestaurant.address);
    setSettingsArea(selectedRestaurant.area);
    setSettingsCity(selectedRestaurant.city);
    setSettingsPhone(selectedRestaurant.phone);
    setSettingsEmail(selectedRestaurant.email);
    setSettingsOpenTime(selectedRestaurant.openingHours.open);
    setSettingsCloseTime(selectedRestaurant.openingHours.close);
    setSettingsDays(selectedRestaurant.openingHours.days);
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurant) return;

    updateRestaurant(selectedRestaurant.id, {
      name: settingsName.trim() || selectedRestaurant.name,
      tagline: settingsTagline.trim(),
      cuisine: settingsCuisine.trim(),
      priceRange: settingsPrice,
      address: settingsAddress.trim(),
      area: settingsArea.trim() || selectedRestaurant.area,
      city: settingsCity.trim() || selectedRestaurant.city,
      phone: settingsPhone.trim(),
      email: settingsEmail.trim(),
      openingHours: {
        open: settingsOpenTime,
        close: settingsCloseTime,
        days: settingsDays,
      },
    });

    setIsSettingsOpen(false);
  };

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
              <Store className="w-3.5 h-3.5" /> Restaurant Owner Portal
            </div>
            <h1 className="text-3xl font-extrabold text-white font-display">
              {selectedRestaurant?.name || 'Restaurant Management'}
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Live operational control, table allocation, and daily schedule for {today}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
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
              onClick={() => navigate('owner-reservations')}
              className="px-3.5 py-2 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Reservations Ledger
            </button>

            <button
              onClick={() => navigate('owner-tables')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer transition-colors"
            >
              <Store className="w-3.5 h-3.5" /> Floor Plan & Tables
            </button>

            <button
              onClick={handleOpenSettings}
              className="px-3.5 py-2 bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-stone-200 font-semibold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" /> Restaurant Settings
            </button>
          </div>
        </div>

        {/* 4 Core Operational KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        {/* Quick Hub Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div
            onClick={() => navigate('owner-tables')}
            className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-900/60 border border-stone-800 hover:border-emerald-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 className="font-bold text-white text-base font-display">Live Floor Plan & Tables</h3>
            <p className="text-xs text-stone-400 mt-1">
              Interactive 2D table layout, capacity tuning, drag-and-drop seating, and live status.
            </p>
            <div className="mt-3 text-xs font-semibold text-emerald-400 flex items-center gap-1">
              Manage {currentTables.length} Tables →
            </div>
          </div>

          <div
            onClick={() => navigate('owner-reservations')}
            className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-900/60 border border-stone-800 hover:border-amber-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 transition-colors" />
            </div>
            <h3 className="font-bold text-white text-base font-display">Daily Reservation Roster</h3>
            <p className="text-xs text-stone-400 mt-1">
              Guest check-ins, table assignment timeline, special requests, and status actions.
            </p>
            <div className="mt-3 text-xs font-semibold text-amber-400 flex items-center gap-1">
              View All {reservations.filter((r) => r.restaurantId === selectedRestaurant?.id).length} Bookings →
            </div>
          </div>

          <div
            onClick={() => navigate('owner-analytics')}
            className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-900/60 border border-stone-800 hover:border-blue-500/40 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-blue-400 transition-colors" />
            </div>
            <h3 className="font-bold text-white text-base font-display">Analytics & Turn Rates</h3>
            <p className="text-xs text-stone-400 mt-1">
              Hourly booking curves, peak occupancy forecasts, AI conversion, and table efficiency.
            </p>
            <div className="mt-3 text-xs font-semibold text-blue-400 flex items-center gap-1">
              Inspect Performance Trends →
            </div>
          </div>
        </div>

        {/* Live Reservation Feed for Today */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl mb-8">
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white font-display">
                Today's Guest Schedule ({today})
              </h2>
            </div>
            <button
              onClick={() => navigate('owner-reservations')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
            >
              Open Full Ledger <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayReservations.length === 0 ? (
            <div className="p-12 text-center text-stone-500 text-xs">
              No reservations scheduled for today at {selectedRestaurant?.name}.
            </div>
          ) : (
            <div className="divide-y divide-stone-800">
              {todayReservations.map((res) => (
                <div
                  key={res.id}
                  className="p-4 hover:bg-stone-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-14 text-center shrink-0">
                      <div className="text-base font-bold text-white font-mono">{res.time}</div>
                      <div className="text-[10px] text-stone-400">{res.durationMinutes} mins</div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-display">
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

        {/* RESTAURANT SETTINGS MODAL */}
        {isSettingsOpen && selectedRestaurant && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                    <Settings className="w-5 h-5 text-amber-400" /> Restaurant Settings
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Update profile, hours of operation, and guest contact details.
                  </p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Restaurant Name</label>
                  <input
                    type="text"
                    value={settingsName}
                    onChange={(e) => setSettingsName(e.target.value)}
                    required
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settingsTagline}
                    onChange={(e) => setSettingsTagline(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Cuisine</label>
                    <input
                      type="text"
                      value={settingsCuisine}
                      onChange={(e) => setSettingsCuisine(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Price Tier</label>
                    <select
                      value={settingsPrice}
                      onChange={(e) => setSettingsPrice(e.target.value as any)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="$">$ Casual</option>
                      <option value="$$">$$ Moderate</option>
                      <option value="$$$">$$$ Upscale</option>
                      <option value="$$$$">$$$$ Fine Dining</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">City</label>
                    <input
                      type="text"
                      value={settingsCity}
                      onChange={(e) => setSettingsCity(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Area / Neighborhood</label>
                    <input
                      type="text"
                      value={settingsArea}
                      onChange={(e) => setSettingsArea(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Full Street Address</label>
                  <input
                    type="text"
                    value={settingsAddress}
                    onChange={(e) => setSettingsAddress(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={settingsPhone}
                      onChange={(e) => setSettingsPhone(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                  <div className="font-semibold text-stone-200">Operating Schedule</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Opening Time</label>
                      <input
                        type="time"
                        value={settingsOpenTime}
                        onChange={(e) => setSettingsOpenTime(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Closing Time</label>
                      <input
                        type="time"
                        value={settingsCloseTime}
                        onChange={(e) => setSettingsCloseTime(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1">Days Open</label>
                      <input
                        type="text"
                        value={settingsDays}
                        onChange={(e) => setSettingsDays(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2 py-1.5 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
