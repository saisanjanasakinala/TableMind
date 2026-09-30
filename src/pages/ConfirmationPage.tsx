import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  MapPin,
  QrCode,
  Download,
  Share2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const ConfirmationPage: React.FC = () => {
  const {
    lastConfirmedReservation,
    cancelReservation,
    navigate,
    showToast,
  } = useApp();

  const [isCancelling, setIsCancelling] = useState(false);

  if (!lastConfirmedReservation) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-stone-400 mb-4">No recent booking found.</p>
          <button
            onClick={() => navigate('discovery')}
            className="px-4 py-2 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs cursor-pointer"
          >
            Find a Restaurant
          </button>
        </div>
      </div>
    );
  }

  const res = lastConfirmedReservation;

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this reservation? The table will be immediately released.')) {
      setIsCancelling(true);
      await cancelReservation(res.id);
      setIsCancelling(false);
      navigate('customer-dashboard');
    }
  };

  const handleAddToCalendar = () => {
    // Generate calendar file (.ics)
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TableMind AI//Reservation//EN
BEGIN:VEVENT
SUMMARY:Dinner at ${res.restaurantName} (Table ${res.tableNumber})
DESCRIPTION:Reservation Code: ${res.reservationCode}\\nGuests: ${res.guestCount}\\nTable: ${res.tableNumber} (${res.seatingPreference})
DTSTART:${res.date.replace(/-/g, '')}T${res.time.replace(':', '')}00
DTEND:${res.date.replace(/-/g, '')}T${(parseInt(res.time.split(':')[0], 10) + 1).toString().padStart(2, '0')}${res.time.split(':')[1]}00
LOCATION:${res.restaurantName}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TableMind-${res.reservationCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Calendar invite downloaded.', 'success');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header Banner */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display">
            Reservation Confirmed!
          </h1>
          <p className="text-xs text-stone-400 mt-1.5">
            Your table is secured and registered on the restaurant floor plan.
          </p>
        </div>

        {/* Boarding-Pass Style Ticket Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Ticket Header */}
          <div className="p-6 bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest opacity-80">
                Official Booking Pass
              </div>
              <div className="text-2xl font-extrabold tracking-tight font-display">
                {res.restaurantName}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold tracking-widest opacity-80">
                Reservation Code
              </div>
              <div className="text-xl font-mono font-extrabold">
                {res.reservationCode}
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-stone-800">
              <div>
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Date
                </span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  {res.date}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Time
                </span>
                <span className="text-sm font-bold text-amber-400 mt-0.5 block">
                  {res.time}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Party Size
                </span>
                <span className="text-sm font-bold text-white mt-0.5 block">
                  {res.guestCount} Guests
                </span>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">
                  Table Number
                </span>
                <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                  {res.tableNumber} ({res.seatingPreference?.toUpperCase() || 'INDOOR'})
                </span>
              </div>
            </div>

            {/* Guest Details & QR Check-In Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
              <div className="space-y-2 text-xs text-stone-300 w-full sm:w-auto">
                <div>
                  <span className="text-stone-500">Reserved for:</span>{' '}
                  <span className="font-semibold text-white">{res.customerName}</span>
                </div>
                <div>
                  <span className="text-stone-500">Contact:</span>{' '}
                  <span>{res.customerEmail} • {res.customerPhone}</span>
                </div>
                {res.specialRequests && (
                  <div className="pt-2 text-[11px] text-amber-300/90 italic">
                    “{res.specialRequests}”
                  </div>
                )}
                {res.aiAssisted && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-400 font-semibold mt-1">
                    <Sparkles className="w-3 h-3" /> Booked via AI Smart Allocation
                  </div>
                )}
              </div>

              {/* Host Stand QR Badge */}
              <div className="p-3 bg-white rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-md">
                <QrCode className="w-20 h-20 text-stone-950" />
                <span className="text-[9px] font-mono font-bold text-stone-800 mt-1">
                  HOST SCAN
                </span>
              </div>
            </div>

            {/* Important Notes */}
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-stone-400 space-y-1">
              <div className="flex items-center gap-1.5 text-stone-200 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Double-Booking Guaranteed Protected
              </div>
              <p>
                Table {res.tableNumber} is reserved exclusively for your party from {res.time} to 90 minutes onward. Please arrive within 15 minutes of reservation time.
              </p>
            </div>
          </div>

          {/* Ticket Footer Actions */}
          <div className="p-6 bg-stone-950 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToCalendar}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Add to Calendar (.ics)
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="px-3.5 py-2 rounded-xl border border-rose-900/60 hover:bg-rose-950/40 text-rose-300 font-medium text-xs cursor-pointer transition-colors"
              >
                Cancel Booking
              </button>
            </div>

            <button
              onClick={() => navigate('customer-dashboard')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
            >
              Go to My Reservations <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
