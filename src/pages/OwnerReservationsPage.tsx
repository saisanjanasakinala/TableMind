import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Filter,
  ChevronLeft,
  Sparkles,
  Phone,
  Mail,
  UserCheck,
  Check,
  AlertCircle,
  Printer,
} from 'lucide-react';
import { getTodayDateString, getTomorrowDateString } from '../data/mockData';
import { Reservation, ReservationStatus } from '../types';

export const OwnerReservationsPage: React.FC = () => {
  const {
    selectedRestaurant,
    reservations,
    updateReservationStatus,
    navigate,
    showToast,
  } = useApp();

  const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'all' | 'custom'>('today');
  const [customDate, setCustomDate] = useState(getTodayDateString());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResDetails, setSelectedResDetails] = useState<Reservation | null>(null);

  if (!selectedRestaurant) return null;

  const today = getTodayDateString();
  const tomorrow = getTomorrowDateString();

  // Filter reservations
  const filteredReservations = useMemo(() => {
    return reservations
      .filter((r) => r.restaurantId === selectedRestaurant.id)
      .filter((r) => {
        // Date filter
        if (dateFilter === 'today' && r.date !== today) return false;
        if (dateFilter === 'tomorrow' && r.date !== tomorrow) return false;
        if (dateFilter === 'custom' && r.date !== customDate) return false;

        // Status filter
        if (statusFilter !== 'all' && r.status !== statusFilter) return false;

        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = r.customerName.toLowerCase().includes(q);
          const matchCode = r.reservationCode.toLowerCase().includes(q);
          const matchPhone = r.customerPhone.toLowerCase().includes(q);
          const matchTable = r.tableNumber.toLowerCase().includes(q);
          if (!matchName && !matchCode && !matchPhone && !matchTable) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      });
  }, [reservations, selectedRestaurant.id, dateFilter, customDate, statusFilter, searchQuery, today, tomorrow]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('owner-dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Overview
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-800">
          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              Guest Registry & Host Stand
            </div>
            <h1 className="text-3xl font-extrabold text-white font-display">
              Reservations Management
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Live guest arrivals, table check-ins, dining duration, and status updates for {selectedRestaurant.name}.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Printer className="w-4 h-4" /> Print Guest List
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 mb-8 shadow-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search */}
            <div className="lg:col-span-5 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest name, phone, table, or code..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Date Quick Tabs */}
            <div className="lg:col-span-4 flex items-center gap-1.5">
              <button
                onClick={() => setDateFilter('today')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  dateFilter === 'today'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setDateFilter('tomorrow')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  dateFilter === 'tomorrow'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
                }`}
              >
                Tomorrow
              </button>
              <button
                onClick={() => setDateFilter('all')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  dateFilter === 'all'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
                }`}
              >
                All Dates
              </button>
              <button
                onClick={() => setDateFilter('custom')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  dateFilter === 'custom'
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'bg-stone-950 text-stone-300 hover:bg-stone-800'
                }`}
              >
                Pick Date
              </button>
            </div>

            {/* Status Filter */}
            <div className="lg:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="seated">Currently Seated</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {dateFilter === 'custom' && (
            <div className="pt-3 border-t border-stone-800 flex items-center gap-3">
              <span className="text-xs text-stone-400">Custom Date:</span>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-white"
              />
            </div>
          )}
        </div>

        {/* Reservations Table */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-display">
              Reservations List ({filteredReservations.length})
            </h2>
            <span className="text-xs text-stone-400">
              Auto-sync with floor availability
            </span>
          </div>

          {filteredReservations.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-400">
              No reservations matched your selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Guest Details</th>
                    <th className="py-3 px-4">Table</th>
                    <th className="py-3 px-4">Guests</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Host Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                  {filteredReservations.map((res) => (
                    <tr
                      key={res.id}
                      className="hover:bg-stone-800/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedResDetails(res)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {res.reservationCode}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{res.time}</div>
                        <div className="text-[11px] text-stone-500">{res.date}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {res.customerName}
                          {res.aiAssisted && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-semibold">
                              AI
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400">{res.customerPhone}</div>
                        {res.specialRequests && (
                          <div className="text-[10px] text-amber-300/80 truncate max-w-xs italic">
                            “{res.specialRequests}”
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-amber-400">
                          Table {res.tableNumber}
                        </span>
                        <div className="text-[10px] uppercase text-stone-500">
                          {res.seatingPreference}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {res.guestCount}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
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
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {res.status === 'confirmed' && (
                            <button
                              onClick={() => updateReservationStatus(res.id, 'seated')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer"
                            >
                              Seat
                            </button>
                          )}
                          {res.status === 'seated' && (
                            <button
                              onClick={() => updateReservationStatus(res.id, 'completed')}
                              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                          {res.status !== 'cancelled' && res.status !== 'completed' && (
                            <button
                              onClick={() => updateReservationStatus(res.id, 'cancelled')}
                              className="px-2 py-1 rounded-lg border border-rose-900/60 hover:bg-rose-950/40 text-rose-300 text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Customer Reservation Details */}
        {selectedResDetails && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                    Reservation Details
                  </span>
                  <h3 className="text-xl font-bold text-white font-display">
                    {selectedResDetails.customerName}
                  </h3>
                  <div className="text-xs text-stone-400 font-mono mt-0.5">
                    Code: {selectedResDetails.reservationCode}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResDetails(null)}
                  className="p-1 text-stone-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-950 rounded-xl border border-stone-800">
                  <div>
                    <span className="text-stone-500 block">Date & Time</span>
                    <span className="font-semibold text-white">
                      {selectedResDetails.date} at {selectedResDetails.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Assigned Table</span>
                    <span className="font-mono font-bold text-amber-400">
                      Table {selectedResDetails.tableNumber} ({selectedResDetails.seatingPreference})
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Party Size</span>
                    <span className="font-semibold text-white">
                      {selectedResDetails.guestCount} Guests
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Current Status</span>
                    <span className="font-bold text-emerald-400 uppercase">
                      {selectedResDetails.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-stone-300">
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    <span>{selectedResDetails.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <Mail className="w-3.5 h-3.5 text-stone-500" />
                    <span>{selectedResDetails.customerEmail}</span>
                  </div>
                </div>

                {selectedResDetails.specialRequests && (
                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold mb-1">
                      Special Requests / Notes:
                    </span>
                    <p className="text-amber-200/90 italic">
                      “{selectedResDetails.specialRequests}”
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-stone-800">
                <div className="flex items-center gap-2">
                  {selectedResDetails.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        updateReservationStatus(selectedResDetails.id, 'seated');
                        setSelectedResDetails({ ...selectedResDetails, status: 'seated' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer"
                    >
                      Seat Guest
                    </button>
                  )}
                  {selectedResDetails.status === 'seated' && (
                    <button
                      onClick={() => {
                        updateReservationStatus(selectedResDetails.id, 'completed');
                        setSelectedResDetails({ ...selectedResDetails, status: 'completed' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs cursor-pointer"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setSelectedResDetails(null)}
                  className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
