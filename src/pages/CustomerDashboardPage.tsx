import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Edit2,
  Trash2,
  Plus,
} from 'lucide-react';
import { Reservation } from '../types';

export const CustomerDashboardPage: React.FC = () => {
  const {
    currentUser,
    reservations,
    cancelReservation,
    modifyReservation,
    navigate,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [editingRes, setEditingRes] = useState<Reservation | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newGuests, setNewGuests] = useState(2);
  const [isSaving, setIsSaving] = useState(false);

  // Filter reservations for current user
  const userReservations = reservations.filter(
    (r) => r.customerId === currentUser.id || r.customerEmail === currentUser.email
  );

  const upcoming = userReservations.filter((r) => r.status === 'confirmed' || r.status === 'seated');
  const completed = userReservations.filter((r) => r.status === 'completed');
  const cancelled = userReservations.filter((r) => r.status === 'cancelled');

  const handleOpenEdit = (res: Reservation) => {
    setEditingRes(res);
    setNewDate(res.date);
    setNewTime(res.time);
    setNewGuests(res.guestCount);
  };

  const handleSaveEdit = async () => {
    if (!editingRes) return;
    setIsSaving(true);

    const res = await modifyReservation(editingRes.id, {
      date: newDate,
      time: newTime,
      guestCount: newGuests,
    });

    setIsSaving(false);
    if (res.success) {
      setEditingRes(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this reservation? The table will be immediately freed.')) {
      await cancelReservation(id);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              Guest Portal
            </div>
            <h1 className="text-3xl font-extrabold text-white font-display">
              My Reservations & Dining History
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Welcome back, {currentUser.name}. Manage your bookings and table assignments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('discovery')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-transform hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Book New Table
            </button>
            <button
              onClick={() => navigate('ai-assistant')}
              className="px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Ask AI
            </button>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'completed'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            Dining History ({completed.length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'cancelled'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            Cancelled ({cancelled.length})
          </button>
        </div>

        {/* Tab 1: Upcoming Reservations */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcoming.length === 0 ? (
              <div className="p-12 text-center bg-stone-900 border border-stone-800 rounded-2xl">
                <Calendar className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white font-display">No upcoming reservations</h3>
                <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                  Ready to dine out? Explore our curated restaurants and book in seconds.
                </p>
                <button
                  onClick={() => navigate('discovery')}
                  className="mt-4 px-4 py-2 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Discover Restaurants
                </button>
              </div>
            ) : (
              upcoming.map((res) => (
                <div
                  key={res.id}
                  className="p-6 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-white font-display">
                        {res.restaurantName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                        {res.status}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-400">
                        {res.reservationCode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>{res.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{res.time} (90 mins)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>{res.guestCount} Guests</span>
                      </div>
                      <div className="text-amber-400 font-mono font-semibold">
                        Table {res.tableNumber} ({res.seatingPreference?.toUpperCase() || 'INDOOR'})
                      </div>
                    </div>

                    {res.specialRequests && (
                      <div className="text-[11px] text-stone-400 italic">
                        Note: {res.specialRequests}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEdit(res)}
                      className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Modify
                    </button>
                    <button
                      onClick={() => handleCancel(res.id)}
                      className="px-3 py-2 rounded-xl border border-rose-900/60 hover:bg-rose-950/40 text-rose-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Dining History */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            {completed.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400 bg-stone-900 border border-stone-800 rounded-2xl">
                No past dining records yet.
              </div>
            ) : (
              completed.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-sm font-bold text-white font-display">
                      {res.restaurantName}
                    </div>
                    <div className="text-xs text-stone-400 mt-1 flex items-center gap-3">
                      <span>{res.date} at {res.time}</span>
                      <span>•</span>
                      <span>{res.guestCount} guests</span>
                      <span>•</span>
                      <span className="font-mono">Table {res.tableNumber}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('booking', res.restaurantId)}
                    className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-xs font-semibold text-amber-300 cursor-pointer transition-colors"
                  >
                    Book Again
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Cancelled */}
        {activeTab === 'cancelled' && (
          <div className="space-y-4">
            {cancelled.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400 bg-stone-900 border border-stone-800 rounded-2xl">
                No cancelled reservations.
              </div>
            ) : (
              cancelled.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-stone-900/40 border border-stone-800/60 opacity-70 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-sm font-semibold text-stone-300">
                      {res.restaurantName}
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      Cancelled for {res.date} at {res.time} • Table {res.tableNumber} released
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-stone-800 text-stone-400">
                    Cancelled
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal: Modify Reservation */}
        {editingRes && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white font-display mb-1">
                Modify Reservation
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                Updating your booking for {editingRes.restaurantName}.
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">New Time</label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                  >
                    {['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(
                      (t) => (
                        <option key={t} value={t} className="bg-stone-900">
                          {t}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Party Size</label>
                  <select
                    value={newGuests}
                    onChange={(e) => setNewGuests(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                      <option key={n} value={n} className="bg-stone-900">
                        {n} Guests
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  onClick={() => setEditingRes(null)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer"
                >
                  {isSaving ? 'Verifying...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
