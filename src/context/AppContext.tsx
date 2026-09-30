import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Restaurant,
  RestaurantTable,
  Reservation,
  ReservationStatus,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_RESTAURANTS,
  INITIAL_TABLES,
  INITIAL_RESERVATIONS,
  getTodayDateString,
} from '../data/mockData';

export type AppView =
  | 'landing'
  | 'discovery'
  | 'restaurant-detail'
  | 'booking'
  | 'ai-assistant'
  | 'confirmation'
  | 'customer-dashboard'
  | 'owner-dashboard'
  | 'owner-tables'
  | 'owner-reservations'
  | 'owner-analytics'
  | 'admin-dashboard'
  | 'auth';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  loginUser: (email: string, name?: string, role?: UserRole) => void;
  logoutUser: () => void;
  activeView: AppView;
  navigate: (view: AppView, restaurantId?: string) => void;
  selectedRestaurantId: string | null;
  selectedRestaurant: Restaurant | undefined;
  setSelectedRestaurantId: (id: string | null) => void;
  restaurants: Restaurant[];
  tables: RestaurantTable[];
  reservations: Reservation[];
  lastConfirmedReservation: Reservation | null;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Table & Booking Operations
  bookReservation: (
    reservationDraft: Omit<Reservation, 'id' | 'reservationCode' | 'createdAt' | 'status'>
  ) => Promise<{ success: boolean; reservation?: Reservation; error?: string }>;
  cancelReservation: (reservationId: string) => Promise<boolean>;
  modifyReservation: (
    reservationId: string,
    updates: Partial<Reservation>
  ) => Promise<{ success: boolean; error?: string }>;
  updateReservationStatus: (reservationId: string, status: ReservationStatus) => void;
  
  // Owner Table Operations
  addTable: (newTable: Omit<RestaurantTable, 'id'>) => void;
  updateTable: (tableId: string, updates: Partial<RestaurantTable>) => void;
  deleteTable: (tableId: string) => void;
  toggleTableActive: (tableId: string) => void;
  
  // Admin Operations
  addRestaurant: (newRest: Omit<Restaurant, 'id'>) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;

  // Availability Helpers
  isTableFree: (tableId: string, date: string, time: string, durationMinutes?: number, excludeReservationId?: string) => boolean;
  getAvailableTablesForParty: (
    restaurantId: string,
    date: string,
    time: string,
    guestCount: number,
    seatingPreference?: string
  ) => RestaurantTable[];
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'tablemind_user_v1',
  RESTAURANTS: 'tablemind_restaurants_v1',
  TABLES: 'tablemind_tables_v1',
  RESERVATIONS: 'tablemind_reservations_v1',
};

// Helper: time string "HH:MM" to minutes
function timeToMins(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

// Helper: check overlap
function hasTimeCollision(t1: string, d1: number, t2: string, d2: number): boolean {
  const s1 = timeToMins(t1);
  const e1 = s1 + d1;
  const s2 = timeToMins(t2);
  const e2 = s2 + d2;
  return Math.max(s1, s2) < Math.min(e1, e2);
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Current User
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEMO_USERS[0]; // Customer
  });

  // 2. Navigation
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>('rest-1');

  // 3. Entity States
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_RESTAURANTS;
  });

  const [tables, setTables] = useState<RestaurantTable[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TABLES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TABLES;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_RESERVATIONS;
  });

  const [lastConfirmedReservation, setLastConfirmedReservation] = useState<Reservation | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigate = (view: AppView, restaurantId?: string) => {
    if (restaurantId) {
      setSelectedRestaurantId(restaurantId);
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchRole = (role: UserRole) => {
    const found = DEMO_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      showToast(`Switched view to ${role.toUpperCase()} (${found.name})`, 'info');
      if (role === 'owner') {
        setSelectedRestaurantId(found.restaurantId || 'rest-1');
        setActiveView('owner-dashboard');
      } else if (role === 'admin') {
        setActiveView('admin-dashboard');
      } else {
        setActiveView('landing');
      }
    }
  };

  const loginUser = (email: string, name?: string, role: UserRole = 'customer') => {
    const existing = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      showToast(`Welcome back, ${existing.name}!`, 'success');
      if (existing.role === 'owner') navigate('owner-dashboard', existing.restaurantId);
      else if (existing.role === 'admin') navigate('admin-dashboard');
      else navigate('customer-dashboard');
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
        restaurantId: role === 'owner' ? 'rest-1' : undefined,
      };
      setCurrentUser(newUser);
      showToast(`Welcome to TableMind AI, ${newUser.name}!`, 'success');
      navigate(role === 'owner' ? 'owner-dashboard' : 'landing');
    }
  };

  const logoutUser = () => {
    const defaultCust = DEMO_USERS[0];
    setCurrentUser(defaultCust);
    showToast('Signed out. Reset to demo customer.', 'info');
    navigate('landing');
  };

  // Check table availability
  const isTableFree = (
    tableId: string,
    date: string,
    time: string,
    durationMinutes = 90,
    excludeReservationId?: string
  ): boolean => {
    const table = tables.find((t) => t.id === tableId);
    if (!table || !table.isActive) return false;

    const conflict = reservations.find(
      (r) =>
        r.tableId === tableId &&
        r.date === date &&
        r.status !== 'cancelled' &&
        (!excludeReservationId || r.id !== excludeReservationId) &&
        hasTimeCollision(r.time, r.durationMinutes || 90, time, durationMinutes)
    );

    return !conflict;
  };

  // Get available tables for party
  const getAvailableTablesForParty = (
    restaurantId: string,
    date: string,
    time: string,
    guestCount: number,
    seatingPreference?: string
  ): RestaurantTable[] => {
    return tables
      .filter((t) => t.restaurantId === restaurantId && t.isActive && t.capacity >= guestCount)
      .filter((t) => isTableFree(t.id, date, time))
      .sort((a, b) => {
        // Sort closest capacity first (anti-waste)
        const capDiffA = a.capacity - guestCount;
        const capDiffB = b.capacity - guestCount;
        if (capDiffA !== capDiffB) return capDiffA - capDiffB;
        if (seatingPreference && a.seatingType === seatingPreference) return -1;
        return 0;
      });
  };

  // Atomic Server-Verified Reservation Booking
  const bookReservation = async (
    reservationDraft: Omit<Reservation, 'id' | 'reservationCode' | 'createdAt' | 'status'>
  ): Promise<{ success: boolean; reservation?: Reservation; error?: string }> => {
    const table = tables.find((t) => t.id === reservationDraft.tableId);

    try {
      // 1. Send to server-side endpoint with atomic lock verification
      const res = await fetch('/api/reservations/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservation: {
            ...reservationDraft,
            status: 'confirmed',
          },
          existingReservations: reservations,
          tableCapacity: table?.capacity,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errorMsg = data.error || 'Booking conflict: Selected table is no longer available.';
        showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }

      const confirmed = data.reservation as Reservation;

      // Update local state
      setReservations((prev) => [confirmed, ...prev]);
      setLastConfirmedReservation(confirmed);
      showToast(`Reservation Confirmed! Code: ${confirmed.reservationCode}`, 'success');
      navigate('confirmation');

      return { success: true, reservation: confirmed };
    } catch (err) {
      // Fallback local verification if offline
      console.warn('Backend call failed, performing robust local validation:', err);

      if (!isTableFree(reservationDraft.tableId, reservationDraft.date, reservationDraft.time, reservationDraft.durationMinutes || 90)) {
        const err = `Double Booking Blocked: Table ${reservationDraft.tableNumber} is already booked for this time window.`;
        showToast(err, 'error');
        return { success: false, error: err };
      }

      const fallbackRes: Reservation = {
        ...reservationDraft,
        id: `res-${Date.now()}`,
        reservationCode: `TM-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      setReservations((prev) => [fallbackRes, ...prev]);
      setLastConfirmedReservation(fallbackRes);
      showToast(`Reservation Confirmed! Code: ${fallbackRes.reservationCode}`, 'success');
      navigate('confirmation');
      return { success: true, reservation: fallbackRes };
    }
  };

  const cancelReservation = async (reservationId: string): Promise<boolean> => {
    try {
      await fetch('/api/reservations/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId }),
      });
    } catch (e) {
      // offline ok
    }

    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: 'cancelled' } : r))
    );
    showToast('Reservation cancelled. Table released immediately.', 'info');
    return true;
  };

  const modifyReservation = async (
    reservationId: string,
    updates: Partial<Reservation>
  ): Promise<{ success: boolean; error?: string }> => {
    const existing = reservations.find((r) => r.id === reservationId);
    if (!existing) return { success: false, error: 'Reservation not found' };

    const checkDate = updates.date || existing.date;
    const checkTime = updates.time || existing.time;
    const checkTableId = updates.tableId || existing.tableId;
    const checkDuration = updates.durationMinutes || existing.durationMinutes || 90;

    // Check availability
    if (!isTableFree(checkTableId, checkDate, checkTime, checkDuration, reservationId)) {
      const err = 'Selected table or time slot has an existing reservation conflict.';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, ...updates } : r))
    );
    showToast('Reservation updated successfully.', 'success');
    return { success: true };
  };

  const updateReservationStatus = (reservationId: string, status: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status } : r))
    );
    showToast(`Reservation status updated to: ${status.toUpperCase()}`, 'info');
  };

  // Table operations
  const addTable = (newTable: Omit<RestaurantTable, 'id'>) => {
    const id = `tab-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const fullTable: RestaurantTable = { ...newTable, id };
    setTables((prev) => [...prev, fullTable]);
    showToast(`Table ${newTable.tableNumber} added to floor plan.`, 'success');
  };

  const updateTable = (tableId: string, updates: Partial<RestaurantTable>) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, ...updates } : t))
    );
    showToast('Table settings saved.', 'success');
  };

  const deleteTable = (tableId: string) => {
    setTables((prev) => prev.filter((t) => t.id !== tableId));
    showToast('Table removed from floor plan.', 'info');
  };

  const toggleTableActive = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, isActive: !t.isActive } : t))
    );
    showToast('Table active status toggled.', 'info');
  };

  // Admin operations
  const addRestaurant = (newRest: Omit<Restaurant, 'id'>) => {
    const id = `rest-${Date.now()}`;
    const fullRest: Restaurant = { ...newRest, id };
    setRestaurants((prev) => [fullRest, ...prev]);
    showToast(`Restaurant "${newRest.name}" registered successfully.`, 'success');
  };

  const updateRestaurant = (id: string, updates: Partial<Restaurant>) => {
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
    showToast('Restaurant details updated.', 'success');
  };

  const deleteRestaurant = (id: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
    showToast('Restaurant removed from platform.', 'info');
  };

  const resetDemoData = () => {
    setRestaurants(INITIAL_RESTAURANTS);
    setTables(INITIAL_TABLES);
    setReservations(INITIAL_RESERVATIONS);
    setCurrentUser(DEMO_USERS[0]);
    localStorage.removeItem(STORAGE_KEYS.RESTAURANTS);
    localStorage.removeItem(STORAGE_KEYS.TABLES);
    localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
    localStorage.removeItem(STORAGE_KEYS.USER);
    showToast('Demo data and reservations reset to pristine state.', 'success');
  };

  const selectedRestaurant = restaurants.find((r) => r.id === selectedRestaurantId) || restaurants[0];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        loginUser,
        logoutUser,
        activeView,
        navigate,
        selectedRestaurantId,
        selectedRestaurant,
        setSelectedRestaurantId,
        restaurants,
        tables,
        reservations,
        lastConfirmedReservation,
        toasts,
        showToast,
        removeToast,
        bookReservation,
        cancelReservation,
        modifyReservation,
        updateReservationStatus,
        addTable,
        updateTable,
        deleteTable,
        toggleTableActive,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        isTableFree,
        getAvailableTablesForParty,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
