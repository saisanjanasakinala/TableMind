import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UtensilsCrossed,
  Sparkles,
  Calendar,
  Compass,
  LayoutDashboard,
  ShieldCheck,
  User as UserIcon,
  ChevronDown,
  RotateCcw,
  Store,
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchRole,
    activeView,
    navigate,
    logoutUser,
    selectedRestaurant,
    resetDemoData,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate('landing')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5 text-stone-950 font-bold" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-white font-display">
                    TableMind
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> AI
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 tracking-wide">Smart Restaurant Reservations</p>
              </div>
            </button>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => navigate('discovery')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'discovery'
                    ? 'bg-stone-800 text-amber-400'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Compass className="w-4 h-4" />
                Find Tables
              </button>

              <button
                onClick={() => navigate('ai-assistant')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'ai-assistant'
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-500/20'
                    : 'text-amber-400 hover:bg-amber-500/10 border border-amber-500/30'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                AI Concierge
              </button>

              {currentUser.role === 'customer' && (
                <button
                  onClick={() => navigate('customer-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'customer-dashboard'
                      ? 'bg-stone-800 text-amber-400'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  My Bookings
                </button>
              )}

              {currentUser.role === 'owner' && (
                <>
                  <button
                    onClick={() => navigate('owner-dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'owner-dashboard'
                        ? 'bg-stone-800 text-amber-400'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Overview
                  </button>
                  <button
                    onClick={() => navigate('owner-tables')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'owner-tables'
                        ? 'bg-stone-800 text-amber-400'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    Floor Plan
                  </button>
                  <button
                    onClick={() => navigate('owner-reservations')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'owner-reservations'
                        ? 'bg-stone-800 text-amber-400'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Reservations
                  </button>
                  <button
                    onClick={() => navigate('owner-analytics')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'owner-analytics'
                        ? 'bg-stone-800 text-amber-400'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                    }`}
                  >
                    Analytics
                  </button>
                </>
              )}

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => navigate('admin-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'admin-dashboard'
                      ? 'bg-stone-800 text-amber-400'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Console
                </button>
              )}
            </nav>
          </div>

          {/* Right Controls: Role Switcher & User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-stone-800 border border-stone-700 hover:border-stone-600 text-xs font-medium text-stone-200 cursor-pointer transition-colors"
                title="Switch active role demo"
              >
                <span className="text-stone-400">Role:</span>
                <span
                  className={`px-1.5 py-0.5 rounded font-semibold capitalize ${
                    currentUser.role === 'customer'
                      ? 'bg-blue-500/20 text-blue-400'
                      : currentUser.role === 'owner'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-purple-500/20 text-purple-400'
                  }`}
                >
                  {currentUser.role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-stone-800 border border-stone-700 rounded-xl shadow-2xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => switchRole('customer')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-700/60 cursor-pointer ${
                      currentUser.role === 'customer' ? 'text-amber-400 font-semibold' : 'text-stone-200'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Customer View</div>
                      <div className="text-[10px] text-stone-400">Alex Morgan (Diner)</div>
                    </div>
                    {currentUser.role === 'customer' && <span className="text-amber-400 text-xs">✓</span>}
                  </button>

                  <button
                    onClick={() => switchRole('owner')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-700/60 cursor-pointer ${
                      currentUser.role === 'owner' ? 'text-amber-400 font-semibold' : 'text-stone-200'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Restaurant Owner</div>
                      <div className="text-[10px] text-stone-400">Chef Julian Vance (L'Étoile)</div>
                    </div>
                    {currentUser.role === 'owner' && <span className="text-amber-400 text-xs">✓</span>}
                  </button>

                  <button
                    onClick={() => switchRole('admin')}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-700/60 cursor-pointer ${
                      currentUser.role === 'admin' ? 'text-amber-400 font-semibold' : 'text-stone-200'
                    }`}
                  >
                    <div>
                      <div className="font-medium">Platform Admin</div>
                      <div className="text-[10px] text-stone-400">Elena Rostova (Full Access)</div>
                    </div>
                    {currentUser.role === 'admin' && <span className="text-amber-400 text-xs">✓</span>}
                  </button>

                  <div className="my-1.5 border-t border-stone-700" />
                  <button
                    onClick={resetDemoData}
                    className="w-full text-left px-3 py-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-700/40 flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Demo Tables & Data
                  </button>
                </div>
              )}
            </div>

            {/* User Profile Avatar / Sign In */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-stone-800">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border border-stone-700 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center text-xs font-semibold text-stone-300">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-stone-200 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-stone-400 truncate max-w-[130px]">
                  {currentUser.role === 'owner' && selectedRestaurant
                    ? selectedRestaurant.name
                    : currentUser.email}
                </div>
              </div>
            </div>

            {/* Mobile View Toggle */}
            <button
              onClick={() => navigate('auth')}
              className="px-2.5 py-1 text-xs rounded border border-stone-700 text-stone-400 hover:text-white md:hidden"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
