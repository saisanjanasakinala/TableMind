import React, { useState, useRef, useEffect } from 'react';
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
  FlaskConical,
  LogOut,
  LogIn,
  Lock,
  ExternalLink,
  Sliders,
} from 'lucide-react';
import { normalizeRole, getRoleDisplayName, UserRole } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    switchDemoPersona,
    activeView,
    navigate,
    logoutUser,
    selectedRestaurant,
    resetDemoData,
  } = useApp();

  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const demoRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const userRole = normalizeRole(currentUser.role);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setDemoMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6 lg:gap-8">
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
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> AI
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 tracking-wide hidden sm:block">
                  Smart Restaurant Reservations & Tables
                </p>
              </div>
            </button>

            {/* Navigation Links - Role Governed */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => navigate('discovery')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'discovery'
                    ? 'bg-stone-800 text-amber-400 border border-stone-700'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Compass className="w-4 h-4" />
                Find Tables
              </button>

              <button
                onClick={() => navigate('ai-assistant')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeView === 'ai-assistant'
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-amber-400 hover:bg-amber-500/10 border border-amber-500/30'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                AI Concierge
              </button>

              {/* CUSTOMER LINKS */}
              {userRole === 'CUSTOMER' && (
                <button
                  onClick={() => navigate('customer-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'customer-dashboard'
                      ? 'bg-stone-800 text-amber-400 border border-stone-700'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  My Bookings
                </button>
              )}

              {/* RESTAURANT_OWNER LINKS */}
              {userRole === 'RESTAURANT_OWNER' && (
                <>
                  <button
                    onClick={() => navigate('owner-dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'owner-dashboard'
                        ? 'bg-stone-800 text-emerald-400 border border-stone-700'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Overview
                  </button>
                  <button
                    onClick={() => navigate('owner-tables')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'owner-tables'
                        ? 'bg-stone-800 text-emerald-400 border border-stone-700'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    Floor Plan
                  </button>
                  <button
                    onClick={() => navigate('owner-reservations')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'owner-reservations'
                        ? 'bg-stone-800 text-emerald-400 border border-stone-700'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Reservations
                  </button>
                  <button
                    onClick={() => navigate('owner-analytics')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'owner-analytics'
                        ? 'bg-stone-800 text-emerald-400 border border-stone-700'
                        : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                    }`}
                  >
                    Analytics
                  </button>
                </>
              )}

              {/* PLATFORM_ADMIN LINKS */}
              {userRole === 'PLATFORM_ADMIN' && (
                <button
                  onClick={() => navigate('admin-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'admin-dashboard'
                      ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Admin Console
                </button>
              )}
            </nav>
          </div>

          {/* Right Controls: Demo Persona Switcher & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1. SEPARATE DEMO MODE SWITCHER (Clearly demarcated for testing) */}
            <div className="relative" ref={demoRef}>
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 text-xs font-medium cursor-pointer transition-colors"
                title="Open developer demo persona switcher"
              >
                <FlaskConical className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="font-bold text-[11px] tracking-wide uppercase">DEMO MODE</span>
                <ChevronDown className="w-3 h-3 text-amber-400" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-stone-800">
                    <FlaskConical className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-bold text-white text-xs">Demo Persona Switcher</div>
                      <div className="text-[10px] text-amber-400 font-medium">Development & Testing Only</div>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-400 mb-2 leading-relaxed">
                    Test role-based access control with preconfigured demo accounts. In real sign-in, access is strictly governed by the authenticated user's stored account role.
                  </p>

                  <div className="space-y-1.5">
                    <button
                      onClick={() => {
                        switchDemoPersona('CUSTOMER');
                        setDemoMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                        userRole === 'CUSTOMER'
                          ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
                          : 'bg-stone-950/60 hover:bg-stone-800 border border-stone-800 text-stone-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs text-white">Alex Morgan (Customer)</div>
                        <div className="text-[10px] text-stone-400">Diner • Find Tables & AI Concierge</div>
                      </div>
                      {userRole === 'CUSTOMER' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300">
                          Active
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        switchDemoPersona('RESTAURANT_OWNER');
                        setDemoMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                        userRole === 'RESTAURANT_OWNER'
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                          : 'bg-stone-950/60 hover:bg-stone-800 border border-stone-800 text-stone-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs text-white">Chef Julian Vance (Owner)</div>
                        <div className="text-[10px] text-stone-400">Operator • Floor Plan & Bookings</div>
                      </div>
                      {userRole === 'RESTAURANT_OWNER' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300">
                          Active
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        switchDemoPersona('PLATFORM_ADMIN');
                        setDemoMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                        userRole === 'PLATFORM_ADMIN'
                          ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                          : 'bg-stone-950/60 hover:bg-stone-800 border border-stone-800 text-stone-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs text-white">Elena Rostova (Admin)</div>
                        <div className="text-[10px] text-stone-400">Super Admin • Oversight & Users</div>
                      </div>
                      {userRole === 'PLATFORM_ADMIN' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300">
                          Active
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-stone-800">
                    <button
                      onClick={() => {
                        resetDemoData();
                        setDemoMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-[11px] text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Demo Tables & Data
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. AUTHENTICATED USER BADGE & MENU (NO ROLE SWITCHING HERE) */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl bg-stone-800/80 border border-stone-700/80 hover:border-stone-600 cursor-pointer transition-colors"
              >
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg border border-stone-700 object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-stone-700 flex items-center justify-center text-xs font-semibold text-stone-300">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded ${
                        userRole === 'CUSTOMER'
                          ? 'bg-blue-500/20 text-blue-300'
                          : userRole === 'RESTAURANT_OWNER'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}
                    >
                      {getRoleDisplayName(userRole)}
                    </span>
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-stone-400 ml-0.5" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="pb-3 border-b border-stone-800">
                    <div className="font-bold text-white text-sm">{currentUser.name}</div>
                    <div className="text-[11px] text-stone-400 truncate">{currentUser.email}</div>
                    
                    <div className="mt-2 p-2 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-stone-500 uppercase tracking-wider">Account Role</div>
                        <div className="font-bold text-xs text-white flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-400" />
                          {getRoleDisplayName(userRole)}
                        </div>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                        Enforced
                      </span>
                    </div>
                  </div>

                  {/* Navigation shortcuts based on role */}
                  <div className="py-2 space-y-1">
                    {userRole === 'CUSTOMER' && (
                      <button
                        onClick={() => {
                          navigate('customer-dashboard');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-stone-200 hover:bg-stone-800 flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-400" /> My Bookings & Profile
                        </span>
                        <ExternalLink className="w-3 h-3 text-stone-500" />
                      </button>
                    )}

                    {userRole === 'RESTAURANT_OWNER' && (
                      <>
                        <button
                          onClick={() => {
                            navigate('owner-dashboard');
                            setProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-xl text-stone-200 hover:bg-stone-800 flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4 text-emerald-400" /> Owner Dashboard
                          </span>
                          <ExternalLink className="w-3 h-3 text-stone-500" />
                        </button>
                        <button
                          onClick={() => {
                            navigate('owner-tables');
                            setProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-xl text-stone-200 hover:bg-stone-800 flex items-center justify-between cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-emerald-400" /> Floor Plan & Tables
                          </span>
                          <ExternalLink className="w-3 h-3 text-stone-500" />
                        </button>
                      </>
                    )}

                    {userRole === 'PLATFORM_ADMIN' && (
                      <button
                        onClick={() => {
                          navigate('admin-dashboard');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-stone-200 hover:bg-stone-800 flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-purple-400" /> Admin Console
                        </span>
                        <ExternalLink className="w-3 h-3 text-stone-500" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        navigate('auth');
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl text-stone-200 hover:bg-stone-800 flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <LogIn className="w-4 h-4 text-stone-400" /> Switch / Register Account
                      </span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-stone-800">
                    <button
                      onClick={() => {
                        logoutUser();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer font-semibold"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Nav Toggle */}
            <button
              onClick={() => navigate('auth')}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-stone-700 bg-stone-800 text-stone-300 hover:text-white md:hidden cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
