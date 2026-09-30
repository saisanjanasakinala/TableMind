import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UtensilsCrossed,
  ShieldCheck,
  User as UserIcon,
  Store,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
} from 'lucide-react';
import { UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';

export const AuthPage: React.FC = () => {
  const { loginUser, switchRole, navigate } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    loginUser(email.trim(), name.trim() || undefined, selectedRole);
  };

  const handleQuickLogin = (role: UserRole) => {
    switchRole(role);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-stone-900 border border-stone-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
            <UtensilsCrossed className="w-6 h-6 text-stone-950 font-bold" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-display">
            {isRegister ? 'Join TableMind AI' : 'Sign in to TableMind AI'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Access intelligent reservations and restaurant management.
          </p>
        </div>

        {/* Quick Demo One-Click Access */}
        <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
          <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Demo Sign-In (1 Click)
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleQuickLogin('customer')}
              className="w-full text-left p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700/60 flex items-center justify-between text-xs cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  C
                </div>
                <div>
                  <div className="font-semibold text-white">Alex Morgan (Diner)</div>
                  <div className="text-[10px] text-stone-400">Customer & Booking view</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </button>

            <button
              onClick={() => handleQuickLogin('owner')}
              className="w-full text-left p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700/60 flex items-center justify-between text-xs cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  O
                </div>
                <div>
                  <div className="font-semibold text-white">Chef Julian Vance (Owner)</div>
                  <div className="text-[10px] text-stone-400">L'Étoile Brasserie & Floor Plan</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </button>

            <button
              onClick={() => handleQuickLogin('admin')}
              className="w-full text-left p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700/60 flex items-center justify-between text-xs cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <div className="font-semibold text-white">Elena Rostova (Admin)</div>
                  <div className="text-[10px] text-stone-400">Cross-Platform Console</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </button>
          </div>
        </div>

        {/* Traditional Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block font-semibold text-stone-300 mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold text-stone-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block font-semibold text-stone-300 mb-1">Account Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="customer">Customer / Diner</option>
                <option value="owner">Restaurant Owner</option>
                <option value="admin">Platform Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition-transform hover:scale-[1.02]"
          >
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-xs text-stone-400">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-amber-400 font-semibold hover:underline cursor-pointer"
          >
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
};
