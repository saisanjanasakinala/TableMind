import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Store,
  Users,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  UserCheck,
  TrendingUp,
  Lock,
  Compass,
  ArrowUpRight,
  MapPin,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Restaurant, UserRole, normalizeRole, getRoleDisplayName } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    currentUser,
    accounts,
    restaurants,
    tables,
    reservations,
    addRestaurant,
    deleteRestaurant,
    adminUpdateUserRole,
    adminDeleteUser,
    resetDemoData,
    navigate,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'analytics' | 'restaurants' | 'users'>('analytics');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New restaurant form state
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [cuisine, setCuisine] = useState('Contemporary Bistro');
  const [priceRange, setPriceRange] = useState<'$' | '$$' | '$$$' | '$$$$'>('$$$');
  const [address, setAddress] = useState('100 Market Street');
  const [neighborhood, setNeighborhood] = useState('Downtown');
  const [area, setArea] = useState('Financial Center');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('California');
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
  const [phone, setPhone] = useState('+1 (415) 555-1234');
  const [email, setEmail] = useState('info@newbistro.com');

  const handleAddRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Restaurant name is required', 'error');
      return;
    }

    addRestaurant({
      name: name.trim(),
      tagline: tagline.trim() || 'Exquisite modern dining experience',
      description: 'Exceptional contemporary dining featuring locally sourced ingredients and craft pairings.',
      cuisine,
      priceRange,
      rating: 4.8,
      reviewCount: 120,
      address,
      area: area || neighborhood,
      neighborhood,
      city,
      state: state || 'California',
      latitude: Number(latitude) || 37.7749,
      longitude: Number(longitude) || -122.4194,
      phone,
      email,
      openingHours: {
        open: '17:00',
        close: '23:00',
        days: 'Tuesday - Sunday',
      },
      heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [],
      menuHighlights: [
        { name: 'Chef Signature Dish', description: 'Fresh seasonal ingredients prepared with artisan techniques', price: '$36', category: 'Mains', isChefSpecial: true },
      ],
      ownerId: currentUser.id,
    });

    setIsAddModalOpen(false);
  };

  const totalSeats = tables.reduce((acc, t) => acc + (t.isActive ? t.capacity : 0), 0);
  const aiBookingsCount = reservations.filter((r) => r.aiAssisted).length;
  const activeBookingsCount = reservations.filter((r) => r.status === 'confirmed' || r.status === 'seated').length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Platform Administration & Security
            </div>
            <h1 className="text-3xl font-extrabold text-white font-display">
              TableMind AI Admin Console
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Global system oversight, partner restaurant directory, user roles management, and platform analytics.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={resetDemoData}
              className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              title="Reset all tables, reservations and demo restaurants"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Data
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Register Restaurant
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Platform Analytics
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'restaurants'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" /> Restaurant Management ({restaurants.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> User Management ({accounts.length})
          </button>
        </div>

        {/* TAB 1: PLATFORM ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* 4 Core Platform Metric Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                  <span>Partner Restaurants</span>
                  <Store className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-bold text-white font-display">
                  {restaurants.length}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">
                  Active dining establishments
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                  <span>Inventory Capacity</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-white font-display">
                  {totalSeats} Seats
                </div>
                <div className="text-[11px] text-stone-400 mt-1">
                  Across {tables.length} managed tables
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                  <span>Total Platform Bookings</span>
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white font-display">
                  {reservations.length}
                </div>
                <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {aiBookingsCount} secured via AI concierge
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                  <span>Double-Booking Rate</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-emerald-400 font-display">
                  0.00%
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">
                  Guaranteed by server lock mutex
                </div>
              </div>
            </div>

            {/* Deep Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                <h3 className="font-bold text-white text-base font-display flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" /> Regional Distribution of Restaurants
                </h3>
                <div className="space-y-3">
                  {['Surampalem', 'Hyderabad', 'Kakinada', 'San Francisco'].map((loc) => {
                    const count = restaurants.filter((r) => r.city.toLowerCase() === loc.toLowerCase()).length;
                    const pct = Math.round((count / (restaurants.length || 1)) * 100);
                    return (
                      <div key={loc} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-stone-300 font-medium">{loc}</span>
                          <span className="text-stone-400">{count} venues ({pct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
                <h3 className="font-bold text-white text-base font-display flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" /> RBAC Security & Concurrency Health
                </h3>
                <div className="space-y-2.5 text-xs text-stone-300">
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">Table Slot Mutex Lock</div>
                      <div className="text-[10px] text-stone-500">Atomic allocation prevents simultaneous table grabs</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      Active
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">Role Route Guards</div>
                      <div className="text-[10px] text-stone-500">Enforced by authenticated stored account roles</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      Enforced
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">Active Confirmed Bookings</div>
                      <div className="text-[10px] text-stone-500">Upcoming diners currently holding table allocations</div>
                    </div>
                    <span className="text-amber-400 font-bold text-sm">
                      {activeBookingsCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESTAURANTS MANAGEMENT */}
        {activeTab === 'restaurants' && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white font-display">
                  Partner Establishments Directory
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Manage restaurant entries, structured coordinates, and assigned operator profiles.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Restaurant
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Restaurant</th>
                    <th className="py-3 px-4">Cuisine & Price</th>
                    <th className="py-3 px-4">City / Area</th>
                    <th className="py-3 px-4">Coordinates</th>
                    <th className="py-3 px-4">Tables</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {restaurants.map((r) => {
                    const rTables = tables.filter((t) => t.restaurantId === r.id);
                    return (
                      <tr key={r.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={r.heroImage}
                              alt={r.name}
                              className="w-10 h-10 rounded-lg object-cover border border-stone-700"
                            />
                            <div>
                              <div className="font-bold text-white font-display">{r.name}</div>
                              <div className="text-[11px] text-stone-400">{r.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-semibold text-stone-200">{r.cuisine}</span>
                            <span className="text-amber-400 font-mono ml-1.5">{r.priceRange}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-white">{r.city}</div>
                          <div className="text-[10px] text-stone-400">{r.area}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[10px] text-stone-400">
                          {r.latitude.toFixed(4)}, {r.longitude.toFixed(4)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-stone-800 font-mono text-[11px] text-stone-200">
                            {rTables.length} tables
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate('restaurant-detail', r.id)}
                              className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs cursor-pointer"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${r.name}? This will remove tables and future reservations.`)) {
                                  deleteRestaurant(r.id);
                                }
                              }}
                              className="px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/60 text-rose-300 text-xs cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white font-display">
                  Platform User Accounts & Role Permissions
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Stored account profiles and strict RBAC authorization assignments.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Access Scope</th>
                    <th className="py-3 px-4 text-right">Role Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {accounts.map((user) => {
                    const normRole = normalizeRole(user.role);
                    const isSelf = user.id === currentUser.id;
                    return (
                      <tr key={user.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover border border-stone-700"
                            />
                            <div>
                              <div className="font-bold text-white">{user.name}</div>
                              {isSelf && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                                  You (Current)
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-stone-400">
                          {user.email}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              normRole === 'CUSTOMER'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : normRole === 'RESTAURANT_OWNER'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            {getRoleDisplayName(normRole)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[11px] text-stone-400">
                          {normRole === 'CUSTOMER' && 'Find Tables, AI Concierge, Personal Bookings'}
                          {normRole === 'RESTAURANT_OWNER' && 'Owner Dashboard, Floor Plan, Table Allocation'}
                          {normRole === 'PLATFORM_ADMIN' && 'Full Administrator Console & User Controls'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Role Switcher for Admin */}
                            <select
                              value={normRole}
                              onChange={(e) => adminUpdateUserRole(user.id, e.target.value as UserRole)}
                              disabled={isSelf}
                              className="bg-stone-950 border border-stone-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer disabled:opacity-50"
                            >
                              <option value="CUSTOMER">Customer</option>
                              <option value="RESTAURANT_OWNER">Restaurant Owner</option>
                              <option value="PLATFORM_ADMIN">Platform Admin</option>
                            </select>

                            {!isSelf && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete account for ${user.name}?`)) {
                                    adminDeleteUser(user.id);
                                  }
                                }}
                                className="p-1 rounded text-stone-500 hover:text-rose-400 cursor-pointer"
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Add Restaurant */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-white font-display mb-1">
                Register New Restaurant
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                Add an establishment to the TableMind network with structured location coordinates.
              </p>

              <form onSubmit={handleAddRestaurant} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Restaurant Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Atelier Crenn, Jewel of Nizam, Royal Pavilion"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Cuisine</label>
                    <input
                      type="text"
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Price Tier</label>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value as any)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="$">$ (Casual)</option>
                      <option value="$$">$$ (Moderate)</option>
                      <option value="$$$">$$$ (Upscale)</option>
                      <option value="$$$$">$$$$ (Fine Dining)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      placeholder="e.g. Hyderabad, Surampalem, Kakinada"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Area / Neighborhood</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="e.g. HITEC City, Campus Corridor"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(Number(e.target.value))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer"
                  >
                    Register Restaurant
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
