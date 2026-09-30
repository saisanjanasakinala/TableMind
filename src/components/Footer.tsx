import React from 'react';
import { useApp } from '../context/AppContext';
import { UtensilsCrossed, Sparkles, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, switchRole } = useApp();

  return (
    <footer className="bg-stone-950 border-t border-stone-800 text-stone-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-white font-display">TableMind AI</span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            The next-generation smart restaurant reservation and table management platform. Preventing double bookings, optimizing seating capacity, and elevating hospitality.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Guaranteed Zero Double-Bookings</span>
          </div>
        </div>

        {/* Diners */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            For Diners
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => navigate('discovery')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Find Available Tables
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('ai-assistant')}
                className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-400" /> AI Reservation Concierge
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate('customer-dashboard')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                My Reservations
              </button>
            </li>
            <li>
              <button
                onClick={() => switchRole('customer')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Customer Demo Persona
              </button>
            </li>
          </ul>
        </div>

        {/* Restaurateurs */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            For Operators
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => {
                  switchRole('owner');
                  navigate('owner-dashboard');
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Owner Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  switchRole('owner');
                  navigate('owner-tables');
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Visual Floor Plan Canvas
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  switchRole('owner');
                  navigate('owner-reservations');
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Host Stand Registry
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  switchRole('owner');
                  navigate('owner-analytics');
                }}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Occupancy Analytics
              </button>
            </li>
          </ul>
        </div>

        {/* Technology & Platform */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Platform & AI
          </h4>
          <ul className="space-y-2 text-xs text-stone-400">
            <li>Built for the Tablekeeper Track</li>
            <li>Gemini 3.8 Flash AI Model</li>
            <li>Smart Allocation Anti-Waste Scoring</li>
            <li>Real-time Dining Turnover Estimation</li>
            <li>
              <button
                onClick={() => {
                  switchRole('admin');
                  navigate('admin-dashboard');
                }}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Platform Admin Console →
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
        <div>© 2026 TableMind AI. All rights reserved.</div>
        <div className="flex items-center gap-1">
          Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for elite hospitality.
        </div>
      </div>
    </footer>
  );
};
