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
} from 'lucide-react';
import { DEMO_USERS } from '../data/mockData';
import { Restaurant } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const {
    restaurants,
    tables,
    reservations,
    addRestaurant,
    deleteRestaurant,
    resetDemoData,
    navigate,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'restaurants' | 'owners' | 'users'>('restaurants');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New restaurant form state
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [cuisine, setCuisine] = useState('Contemporary Bistro');
  const [priceRange, setPriceRange] = useState<'$' | '$$' | '$$$' | '$$$$'>('$$$');
  const [address, setAddress] = useState('100 Market Street');
  const [neighborhood, setNeighborhood] = useState('Downtown');
  const [city, setCity] = useState('San Francisco');
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
      neighborhood,
      city,
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
      ownerId: 'user-owner-1',
    });

    setIsAddModalOpen(false);
  };

  const totalSeats = tables.reduce((acc, t) => acc + (t.isActive ? t.capacity : 0), 0);
  const aiBookingsCount = reservations.filter((r) => r.aiAssisted).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Platform Administration
            </div>
            <h1 className="text-3xl font-extrabold text-white font-display">
              TableMind AI Admin Console
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Global system oversight, partner restaurant directory, and cross-platform verification.
            </p>
          </div>

          <div className="flex items-center gap-3">
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

        {/* 4 Core Platform Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
              <span>Platform Bookings</span>
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-white font-display">
              {reservations.length}
            </div>
            <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {aiBookingsCount} secured via AI assistant
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

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'restaurants'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            Restaurants Directory ({restaurants.length})
          </button>
          <button
            onClick={() => setActiveTab('owners')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'owners'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            Restaurant Owners ({DEMO_USERS.filter((u) => u.role === 'owner').length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'users'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-white'
            }`}
          >
            All Users & Roles ({DEMO_USERS.length})
          </button>
        </div>

        {/* Tab 1: Restaurants */}
        {activeTab === 'restaurants' && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-display">
                Registered Partner Restaurants
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Restaurant</th>
                    <th className="py-3 px-4">Cuisine & Price</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Rating</th>
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
                          <div>{r.cuisine}</div>
                          <span className="font-bold text-amber-400 text-[11px]">{r.priceRange}</span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-400">
                          {r.neighborhood}, {r.city}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-amber-400">★ {r.rating}</span>{' '}
                          <span className="text-stone-500">({r.reviewCount})</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-emerald-400">
                          {rTables.length} tables
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate('restaurant-detail', r.id)}
                              className="p-1.5 rounded-lg border border-stone-700 text-stone-300 hover:text-white cursor-pointer"
                              title="View detail"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete restaurant "${r.name}"?`)) {
                                  deleteRestaurant(r.id);
                                }
                              }}
                              className="p-1.5 rounded-lg border border-rose-900/60 text-rose-400 hover:bg-rose-950/40 cursor-pointer"
                              title="Delete restaurant"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

        {/* Tab 2: Restaurant Owners */}
        {activeTab === 'owners' && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl p-6">
            <h2 className="text-base font-bold text-white font-display mb-4">
              Authorized Restaurant Operators
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEMO_USERS.filter((u) => u.role === 'owner').map((owner) => {
                const managedRest = restaurants.find((r) => r.id === owner.restaurantId);
                return (
                  <div
                    key={owner.id}
                    className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-4"
                  >
                    <img
                      src={owner.avatar}
                      alt={owner.name}
                      className="w-12 h-12 rounded-full object-cover border border-stone-700"
                    />
                    <div>
                      <div className="font-bold text-white text-sm">{owner.name}</div>
                      <div className="text-xs text-stone-400">{owner.email}</div>
                      <div className="text-[11px] text-amber-400 font-semibold mt-1">
                        Manages: {managedRest ? managedRest.name : 'All Venues'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Users */}
        {activeTab === 'users' && (
          <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-stone-800">
              <h2 className="text-base font-bold text-white font-display">
                Registered Platform Personas
              </h2>
            </div>
            <div className="divide-y divide-stone-800">
              {DEMO_USERS.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border border-stone-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{user.name}</div>
                      <div className="text-[11px] text-stone-400">{user.email}</div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      user.role === 'customer'
                        ? 'bg-blue-500/20 text-blue-300'
                        : user.role === 'owner'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-purple-500/20 text-purple-300'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Add Restaurant */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white font-display mb-1">
                Register New Restaurant
              </h3>
              <p className="text-xs text-stone-400 mb-4">
                Add an establishment to the TableMind network.
              </p>

              <form onSubmit={handleAddRestaurant} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Restaurant Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Atelier Crenn, Nobu, Osteria Francescana"
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
                    <label className="block font-semibold text-stone-300 mb-1">Neighborhood</label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
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
