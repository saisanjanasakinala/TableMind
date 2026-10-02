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
  FlaskConical,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { UserRole, getRoleDisplayName } from '../types';

export const AuthPage: React.FC = () => {
  const { loginUser, switchDemoPersona, accounts } = useApp();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    loginUser(email.trim(), name.trim() || undefined, selectedRole, password);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchDemoPersona(role);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-stone-900 border border-stone-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
            <UtensilsCrossed className="w-6 h-6 text-stone-950 font-bold" />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-display">
            {isRegister ? 'Create TableMind Account' : 'Sign In to TableMind AI'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Intelligent reservations, interactive floor plans & role-secured dashboards.
          </p>
        </div>

        {/* DEMO PERSONA QUICK LOGIN SECTION (Clearly demarcated for development) */}
        <div className="p-4 rounded-2xl bg-stone-950/80 border border-amber-500/30">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
              Demo Persona Quick Sign-In
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
              DEMO MODE
            </span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleQuickDemoLogin('CUSTOMER')}
              className="w-full text-left p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 flex items-center justify-between text-xs cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  C
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                    Alex Morgan (Customer)
                  </div>
                  <div className="text-[10px] text-stone-400">Diner • Find Tables, AI Concierge, Bookings</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-white" />
            </button>

            <button
              onClick={() => handleQuickDemoLogin('RESTAURANT_OWNER')}
              className="w-full text-left p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 flex items-center justify-between text-xs cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  O
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    Chef Julian Vance (Owner)
                  </div>
                  <div className="text-[10px] text-stone-400">Operator • Floor Plan & Table Management</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-white" />
            </button>

            <button
              onClick={() => handleQuickDemoLogin('PLATFORM_ADMIN')}
              className="w-full text-left p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 flex items-center justify-between text-xs cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                    Elena Rostova (Admin)
                  </div>
                  <div className="text-[10px] text-stone-400">Super Admin • Oversight & User Accounts</div>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Traditional Email Form (Stores Authoritative Role) */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-1 text-stone-400 border-b border-stone-800 text-[11px] font-semibold uppercase tracking-wider">
            <Lock className="w-3 h-3 text-stone-500" />
            {isRegister ? 'Register New Account' : 'Authenticate with Stored Credentials'}
          </div>

          {isRegister && (
            <div>
              <label className="block font-semibold text-stone-300 mb-1">Your Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
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
            {!isRegister && (
              <p className="text-[10px] text-stone-500 mt-1">
                Your stored account role will be automatically verified on login.
              </p>
            )}
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
              <label className="block font-semibold text-stone-300 mb-1">Select Account Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="CUSTOMER">Customer / Diner (Find Tables & AI Concierge)</option>
                <option value="RESTAURANT_OWNER">Restaurant Owner (Floor Plan & Reservations)</option>
                <option value="PLATFORM_ADMIN">Platform Admin (Network Oversight & Management)</option>
              </select>
              <div className="mt-1.5 p-2 rounded-lg bg-stone-950 border border-stone-800 text-[10px] text-stone-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  The assigned role is stored permanently in your account data and determines authorized dashboards.
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 cursor-pointer transition-transform hover:scale-[1.01]"
          >
            {isRegister ? 'Register & Access Dashboard' : 'Sign In with Verified Role'}
          </button>
        </form>

        <div className="text-center text-xs text-stone-400">
          {isRegister ? 'Already registered an account?' : "Need a new account?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-amber-400 font-semibold hover:underline cursor-pointer"
          >
            {isRegister ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
