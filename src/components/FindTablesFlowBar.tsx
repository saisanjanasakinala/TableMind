import React from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Utensils,
  Calendar,
  Clock,
  Users,
  Grid3X3,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface FindTablesFlowBarProps {
  currentStep: 'location' | 'restaurant' | 'date-time' | 'guests' | 'tables' | 'reservation';
  restaurantName?: string;
  selectedTableNumber?: string;
}

export const FindTablesFlowBar: React.FC<FindTablesFlowBarProps> = ({
  currentStep,
  restaurantName,
  selectedTableNumber,
}) => {
  const { userLocation, bookingDate, bookingTime, bookingPartySize, navigate, selectedRestaurantId } = useApp();

  const steps = [
    {
      id: 'location',
      title: '1. Location',
      value: userLocation ? userLocation.label.split(',')[0] : 'All Areas',
      icon: MapPin,
      onClick: () => navigate('discovery'),
    },
    {
      id: 'restaurant',
      title: '2. Restaurant',
      value: restaurantName || 'Choose Spot',
      icon: Utensils,
      onClick: () => navigate('discovery'),
    },
    {
      id: 'date-time',
      title: '3. Date & Time',
      value: `${bookingDate.slice(5)} @ ${bookingTime}`,
      icon: Calendar,
      onClick: () => {
        if (selectedRestaurantId) navigate('booking', selectedRestaurantId);
        else navigate('discovery');
      },
    },
    {
      id: 'guests',
      title: '4. Guests',
      value: `${bookingPartySize} ${bookingPartySize === 1 ? 'Guest' : 'Guests'}`,
      icon: Users,
      onClick: () => {
        if (selectedRestaurantId) navigate('booking', selectedRestaurantId);
        else navigate('discovery');
      },
    },
    {
      id: 'tables',
      title: '5. Available Tables',
      value: selectedTableNumber ? `Table ${selectedTableNumber}` : 'Select Slot',
      icon: Grid3X3,
      onClick: () => {
        if (selectedRestaurantId) navigate('booking', selectedRestaurantId);
      },
    },
    {
      id: 'reservation',
      title: '6. Reservation',
      value: 'Instant Lock',
      icon: CheckCircle2,
      onClick: undefined,
    },
  ];

  const stepOrder = ['location', 'restaurant', 'date-time', 'guests', 'tables', 'reservation'];
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="w-full bg-stone-900/80 border border-stone-800 rounded-2xl p-2.5 sm:p-3 mb-6 shadow-md backdrop-blur-md">
      <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-1 sm:gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <React.Fragment key={step.id}>
              <button
                type="button"
                onClick={step.onClick}
                disabled={!step.onClick}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all text-left shrink-0 ${
                  isCurrent
                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                    : isCompleted
                    ? 'bg-stone-950/40 hover:bg-stone-800 text-stone-300 cursor-pointer'
                    : 'text-stone-500 opacity-60'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-stone-800 text-stone-500'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <div className="leading-tight">
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                    {step.title}
                  </div>
                  <div className="text-[11px] font-semibold text-white truncate max-w-[100px] sm:max-w-[120px]">
                    {step.value}
                  </div>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-stone-700 shrink-0 hidden sm:block" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
