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
  Compass,
  User as UserIcon,
  ShieldCheck,
  Lock,
  Save,
  Utensils,
  Phone,
  Mail,
  Heart,
} from 'lucide-react';
import { Reservation, SeatingType } from '../types';

export const CustomerDashboardPage: React.FC = () => {
  const {
    currentUser,
    reservations,
    cancelReservation,
    modifyReservation,
    updateUserProfile,
    navigate,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled' | 'profile'>('upcoming');
  const [editingRes, setEditingRes] = useState<Reservation | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newGuests, setNewGuests] = useState(2);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser.phone || '');
  const [selectedSeating, setSelectedSeating] = useState<SeatingType>(currentUser.seatingPreference || 'indoor');
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(currentUser.dietaryPreferences || ['Vegetarian']);
  const [diningNotes, setDiningNotes] = useState(currentUser.specialNotes || '');

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

  const toggleDietary = (item: string) => {
    setDietaryPrefs((prev) =>
      prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item]
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName.trim() || currentUser.name,
      phone: profilePhone.trim(),
      seatingPreference: selectedSeating,
      dietaryPreferences: dietaryPrefs,
      specialNotes: diningNotes.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Customer Dining Hub
            </div>
            <h1 className="text-3xl font-extrabold text-white font-display">
              My Reservations & Profile
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Welcome back, {currentUser.name}. Manage your bookings, dining history and preferences.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('discovery')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-transform hover:scale-105"
            >
              <Compass className="w-4 h-4" /> Find Tables
            </button>
            <button
              onClick={() => navigate('ai-assistant')}
              className="px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 text-amber-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Concierge
            </button>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            Upcoming Reservations ({upcoming.length})
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
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" /> Profile & Preferences
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
                  className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-stone-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base font-display">
                        {res.restaurantName}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-stone-800 text-stone-400 border border-stone-700">
                        {res.reservationCode}
                      </span>
                      {res.aiAssisted && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-semibold flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> Booked by TableMind AI
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-400">
                      <span className="flex items-center gap-1.5 text-stone-200">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        {res.date}
                      </span>
                      <span className="flex items-center gap-1.5 text-stone-200">
                        <Clock className="w-4 h-4 text-amber-400" />
                        {res.time}
                      </span>
                      <span className="flex items-center gap-1.5 text-stone-200">
                        <Users className="w-4 h-4 text-amber-400" />
                        {res.guestCount} Guests
                      </span>
                      <span className="flex items-center gap-1.5 text-stone-200">
                        <Utensils className="w-4 h-4 text-amber-400" />
                        Table {res.tableNumber}
                      </span>
                      {res.seatingPreference && (
                        <span className="capitalize px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 text-[11px]">
                          {res.seatingPreference}
                        </span>
                      )}
                    </div>

                    {res.specialRequests && (
                      <div className="text-xs text-amber-300/80 italic">
                        “{res.specialRequests}”
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => handleOpenEdit(res)}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Modify
                    </button>
                    <button
                      onClick={() => handleCancel(res.id)}
                      className="px-3 py-1.5 rounded-xl border border-rose-900/60 hover:bg-rose-950/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
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
              <div className="p-12 text-center bg-stone-900 border border-stone-800 rounded-2xl text-stone-400 text-xs">
                No past dining records found.
              </div>
            ) : (
              completed.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between opacity-80"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{res.restaurantName}</div>
                    <div className="text-xs text-stone-400 mt-1">
                      {res.date} at {res.time} • {res.guestCount} Guests • Table {res.tableNumber}
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-stone-800 text-stone-400 text-xs font-semibold uppercase">
                    Completed
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Cancelled Reservations */}
        {activeTab === 'cancelled' && (
          <div className="space-y-4">
            {cancelled.length === 0 ? (
              <div className="p-12 text-center bg-stone-900 border border-stone-800 rounded-2xl text-stone-400 text-xs">
                No cancelled reservations.
              </div>
            ) : (
              cancelled.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center justify-between opacity-60"
                >
                  <div>
                    <div className="font-bold text-stone-300 text-sm line-through">
                      {res.restaurantName}
                    </div>
                    <div className="text-xs text-stone-500 mt-1">
                      {res.date} at {res.time} • {res.guestCount} Guests
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-rose-950/40 text-rose-400 border border-rose-900/40 text-xs font-semibold uppercase">
                    Cancelled
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Profile & Preferences */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Card */}
            <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 h-fit space-y-4">
              <div className="text-center pb-4 border-b border-stone-800">
                <div className="w-16 h-16 rounded-full bg-stone-800 border-2 border-stone-700 mx-auto mb-3 overflow-hidden flex items-center justify-center">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-8 h-8 text-stone-400" />
                  )}
                </div>
                <h3 className="text-base font-bold text-white font-display">{currentUser.name}</h3>
                <p className="text-xs text-stone-400">{currentUser.email}</p>
              </div>

              {/* RBAC Security Badge */}
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                    Role-Based Access
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                    CUSTOMER
                  </span>
                </div>
                <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Enforced Account Role: Verified Diner Profile</span>
                </div>
                <p className="text-[10px] text-stone-500">
                  Customers are restricted to discovery, AI concierge, and personal reservations. Restaurant Owner and Platform Admin dashboards cannot be accessed.
                </p>
              </div>

              <div className="space-y-2 text-xs text-stone-400 pt-2">
                <div className="flex items-center justify-between">
                  <span>Registered Member Since:</span>
                  <span className="text-white font-medium">2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Reservations:</span>
                  <span className="text-amber-400 font-bold">{userReservations.length}</span>
                </div>
              </div>
            </div>

            {/* Profile & Dining Preferences Form */}
            <form
              onSubmit={handleSaveProfile}
              className="lg:col-span-2 p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-5"
            >
              <div>
                <h2 className="text-base font-bold text-white font-display mb-1 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-amber-400" /> Dining Preferences & Contact Details
                </h2>
                <p className="text-xs text-stone-400">
                  TableMind AI and host venues automatically apply your preferred seating and dietary needs when finding tables.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    required
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Seating Preference */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Preferred Seating Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {(['indoor', 'patio', 'booth', 'window', 'bar', 'private'] as SeatingType[]).map((seat) => (
                    <button
                      key={seat}
                      type="button"
                      onClick={() => setSelectedSeating(seat)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors capitalize ${
                        selectedSeating === seat
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                      }`}
                    >
                      {seat === 'window' && '🪟 '}
                      {seat === 'booth' && '🛋️ '}
                      {seat === 'patio' && '🌿 '}
                      {seat === 'indoor' && '🍽️ '}
                      {seat === 'bar' && '🍸 '}
                      {seat === 'private' && '🔒 '}
                      {seat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Preferences */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Dietary Preferences & Allergies
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    'Vegetarian',
                    'Vegan',
                    'Gluten-Free',
                    'Halal',
                    'Jain',
                    'Dairy-Free',
                    'Nut-Free',
                    'Pescatarian',
                  ].map((diet) => {
                    const active = dietaryPrefs.includes(diet);
                    return (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => toggleDietary(diet)}
                        className={`px-3 py-1.5 rounded-xl border cursor-pointer transition-colors text-xs ${
                          active
                            ? 'bg-amber-500 text-stone-950 font-bold border-amber-500'
                            : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {diet}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Requests / Notes */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Default Dining Notes & Special Requests
                </label>
                <textarea
                  rows={3}
                  value={diningNotes}
                  onChange={(e) => setDiningNotes(e.target.value)}
                  placeholder="e.g. Anniversary dinner, prefer quiet corner, no ice in water"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Preferences
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal: Modify Reservation */}
        {editingRes && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
              <h3 className="text-base font-bold text-white font-display mb-1">
                Modify Reservation
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                {editingRes.restaurantName} • Table {editingRes.tableNumber}
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
                  className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white cursor-pointer"
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
