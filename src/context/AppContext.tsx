import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Restaurant,
  RestaurantTable,
  Reservation,
  ReservationStatus,
  UserLocation,
  normalizeRole,
  getRoleDisplayName,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_RESTAURANTS,
  INITIAL_TABLES,
  INITIAL_RESERVATIONS,
  PRESET_LOCATIONS,
  getTodayDateString,
  calculateDistanceKm,
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

export interface RouteProtectionRule {
  allowedRoles: ('CUSTOMER' | 'RESTAURANT_OWNER' | 'PLATFORM_ADMIN')[];
  getFallbackView: (userRole: 'CUSTOMER' | 'RESTAURANT_OWNER' | 'PLATFORM_ADMIN') => AppView;
  deniedMessage: string;
}

export const PROTECTED_VIEWS: Partial<Record<AppView, RouteProtectionRule>> = {
  'owner-dashboard': {
    allowedRoles: ['RESTAURANT_OWNER', 'PLATFORM_ADMIN'],
    getFallbackView: (role) => (role === 'CUSTOMER' ? 'customer-dashboard' : 'landing'),
    deniedMessage: 'Access Denied: Restaurant Owner credentials required to access the Owner Dashboard.',
  },
  'owner-tables': {
    allowedRoles: ['RESTAURANT_OWNER', 'PLATFORM_ADMIN'],
    getFallbackView: (role) => (role === 'CUSTOMER' ? 'customer-dashboard' : 'landing'),
    deniedMessage: 'Access Denied: Floor Plan & Table Management is restricted to Restaurant Owners.',
  },
  'owner-reservations': {
    allowedRoles: ['RESTAURANT_OWNER', 'PLATFORM_ADMIN'],
    getFallbackView: (role) => (role === 'CUSTOMER' ? 'customer-dashboard' : 'landing'),
    deniedMessage: 'Access Denied: Restaurant reservation ledger is restricted to Restaurant Owners.',
  },
  'owner-analytics': {
    allowedRoles: ['RESTAURANT_OWNER', 'PLATFORM_ADMIN'],
    getFallbackView: (role) => (role === 'CUSTOMER' ? 'customer-dashboard' : 'landing'),
    deniedMessage: 'Access Denied: Restaurant Analytics reports are restricted to Restaurant Owners.',
  },
  'admin-dashboard': {
    allowedRoles: ['PLATFORM_ADMIN'],
    getFallbackView: (role) => (role === 'RESTAURANT_OWNER' ? 'owner-dashboard' : 'customer-dashboard'),
    deniedMessage: 'Access Denied: Platform Administrator privileges are required.',
  },
};

export function getDefaultDashboardForRole(role: string | undefined): AppView {
  const norm = normalizeRole(role);
  switch (norm) {
    case 'RESTAURANT_OWNER':
      return 'owner-dashboard';
    case 'PLATFORM_ADMIN':
      return 'admin-dashboard';
    case 'CUSTOMER':
    default:
      return 'customer-dashboard';
  }
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  accounts: User[];
  switchDemoPersona: (role: UserRole) => void;
  switchRole: (role: UserRole) => void;
  loginUser: (email: string, name?: string, role?: UserRole, password?: string) => { success: boolean; error?: string };
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
  
  // Location & Flow State
  userLocation: UserLocation | null;
  setUserLocation: (loc: UserLocation | null) => void;
  searchRadiusKm: number;
  setSearchRadiusKm: (radius: number) => void;
  bookingDate: string;
  setBookingDate: (date: string) => void;
  bookingTime: string;
  setBookingTime: (time: string) => void;
  bookingPartySize: number;
  setBookingPartySize: (guests: number) => void;

  // User & Admin Operations
  updateUserProfile: (updates: Partial<User>) => void;
  adminUpdateUserRole: (userId: string, newRole: UserRole) => void;
  adminDeleteUser: (userId: string) => void;

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
  USER: 'tablemind_user_v2',
  ACCOUNTS: 'tablemind_registered_accounts_v2',
  RESTAURANTS: 'tablemind_restaurants_v4',
  TABLES: 'tablemind_tables_v4',
  RESERVATIONS: 'tablemind_reservations_v1',
  LOCATION: 'tablemind_user_location_v2',
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
  // 1. Registered Accounts Store (Persistent)
  const [accounts, setAccounts] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        const merged = [...parsed];
        for (const demoU of DEMO_USERS) {
          if (!merged.some((u) => u.email.toLowerCase() === demoU.email.toLowerCase())) {
            merged.push(demoU);
          }
        }
        return merged.map((u) => ({ ...u, role: normalizeRole(u.role) }));
      } catch (e) { /* ignore */ }
    }
    return DEMO_USERS.map((u) => ({ ...u, role: normalizeRole(u.role) }));
  });

  // Current Authenticated User (with verified stored role)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        const parsed: User = JSON.parse(saved);
        return {
          ...parsed,
          role: normalizeRole(parsed.role),
        };
      } catch (e) { /* ignore */ }
    }
    return DEMO_USERS[0]; // Customer Alex Morgan
  });

  // 2. Navigation
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>('rest-surampalem-1');

  // 3. Location State (defaults to Surampalem for rich demo)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOCATION);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default preset: Surampalem
    const defaultPreset =
      PRESET_LOCATIONS.find((p) => p.id === 'loc-surampalem') || PRESET_LOCATIONS[0];
    return {
      label: `${defaultPreset.name}, ${defaultPreset.state}`,
      mode: 'preset',
      latitude: defaultPreset.latitude,
      longitude: defaultPreset.longitude,
      city: defaultPreset.city,
      area: defaultPreset.area,
      state: defaultPreset.state,
    };
  });

  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(25);

  // 4. Booking Flow Parameters
  const [bookingDate, setBookingDate] = useState<string>(getTodayDateString());
  const [bookingTime, setBookingTime] = useState<string>('19:00');
  const [bookingPartySize, setBookingPartySize] = useState<number>(2);

  // 5. Entity States
  const [restaurants, setRestaurants] = useState<Restaurant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
    if (saved) {
      try {
        const parsed: Restaurant[] = JSON.parse(saved);
        const merged = INITIAL_RESTAURANTS.map((initR) => {
          const mod = parsed.find((p) => p.id === initR.id);
          return mod
            ? {
                ...initR,
                ...mod,
                city: initR.city,
                area: initR.area,
                state: initR.state,
                latitude: initR.latitude,
                longitude: initR.longitude,
              }
            : initR;
        });
        for (const p of parsed) {
          if (!merged.some((r) => r.id === p.id)) {
            merged.push(p);
          }
        }
        return merged;
      } catch (e) { /* ignore */ }
    }
    return INITIAL_RESTAURANTS;
  });

  const [tables, setTables] = useState<RestaurantTable[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TABLES);
    if (saved) {
      try {
        const parsed: RestaurantTable[] = JSON.parse(saved);
        const merged = [...INITIAL_TABLES];
        for (const p of parsed) {
          if (!merged.some((t) => t.id === p.id)) {
            merged.push(p);
          }
        }
        return merged;
      } catch (e) { /* ignore */ }
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
    if (userLocation) {
      localStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(userLocation));
    } else {
      localStorage.removeItem(STORAGE_KEYS.LOCATION);
    }
  }, [userLocation]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

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
    // 1. Role-based Access Control Check
    const rule = PROTECTED_VIEWS[view];
    const userRole = normalizeRole(currentUser.role);

    if (rule && !rule.allowedRoles.includes(userRole)) {
      const fallback = rule.getFallbackView(userRole);
      showToast(rule.deniedMessage, 'error');
      if (restaurantId) setSelectedRestaurantId(restaurantId);
      setActiveView(fallback);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (restaurantId) {
      setSelectedRestaurantId(restaurantId);
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchDemoPersona = (role: UserRole) => {
    const targetNorm = normalizeRole(role);
    const found = DEMO_USERS.find((u) => normalizeRole(u.role) === targetNorm);
    if (found) {
      const demoAccount: User = {
        ...found,
        role: targetNorm,
      };
      setCurrentUser(demoAccount);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(demoAccount));
      showToast(`DEMO MODE: Switched persona to ${getRoleDisplayName(targetNorm)} (${demoAccount.name})`, 'info');

      if (targetNorm === 'RESTAURANT_OWNER') {
        setSelectedRestaurantId(demoAccount.restaurantId || 'rest-1');
        setActiveView('owner-dashboard');
      } else if (targetNorm === 'PLATFORM_ADMIN') {
        setActiveView('admin-dashboard');
      } else {
        setActiveView('customer-dashboard');
      }
    }
  };

  const switchRole = switchDemoPersona; // Alias for backward compatibility

  const loginUser = (email: string, name?: string, role: UserRole = 'CUSTOMER', password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      showToast('Please enter an email address.', 'error');
      return { success: false, error: 'Email is required' };
    }

    // 1. Look up existing registered user account (case-insensitive)
    const existing = accounts.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      // The stored account role is authoritative! A customer account cannot become owner/admin by UI override
      const storedRole = normalizeRole(existing.role);
      const authenticatedUser: User = {
        ...existing,
        role: storedRole,
      };

      setCurrentUser(authenticatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authenticatedUser));
      showToast(`Welcome back, ${authenticatedUser.name}! (${getRoleDisplayName(storedRole)})`, 'success');

      if (storedRole === 'RESTAURANT_OWNER') {
        const restId = authenticatedUser.restaurantId || 'rest-1';
        setSelectedRestaurantId(restId);
        setActiveView('owner-dashboard');
      } else if (storedRole === 'PLATFORM_ADMIN') {
        setActiveView('admin-dashboard');
      } else {
        setActiveView('customer-dashboard');
      }
      return { success: true };
    }

    // 2. New Account Registration: store the chosen role permanently with the account profile
    const assignedRole = normalizeRole(role);
    const newAccount: User = {
      id: `user-${Date.now()}`,
      name: name?.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: assignedRole,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
      restaurantId: assignedRole === 'RESTAURANT_OWNER' ? 'rest-1' : undefined,
      password: password || undefined,
      createdAt: new Date().toISOString(),
    };

    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updatedAccounts));

    setCurrentUser(newAccount);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newAccount));
    showToast(`Account registered as ${getRoleDisplayName(assignedRole)}! Welcome, ${newAccount.name}.`, 'success');

    if (assignedRole === 'RESTAURANT_OWNER') {
      setSelectedRestaurantId('rest-1');
      setActiveView('owner-dashboard');
    } else if (assignedRole === 'PLATFORM_ADMIN') {
      setActiveView('admin-dashboard');
    } else {
      setActiveView('customer-dashboard');
    }
    return { success: true };
  };

  const logoutUser = () => {
    const guestCustomer = DEMO_USERS[0];
    setCurrentUser(guestCustomer);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(guestCustomer));
    showToast('Signed out. Switched to public guest session.', 'info');
    setActiveView('landing');
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

  // Profile updates (role is immutable through normal profile editing)
  const updateUserProfile = (updates: Partial<User>) => {
    // Prevent unauthorized role alteration via profile edit
    const safeUpdates = { ...updates };
    delete safeUpdates.role;
    delete safeUpdates.id;

    const updatedUser = { ...currentUser, ...safeUpdates };
    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));

    setAccounts((prev) => {
      const next = prev.map((acc) => (acc.id === updatedUser.id ? { ...acc, ...safeUpdates } : acc));
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(next));
      return next;
    });

    showToast('Your profile preferences have been updated.', 'success');
  };

  // Platform Admin User Management: change role
  const adminUpdateUserRole = (userId: string, newRole: UserRole) => {
    const callerRole = normalizeRole(currentUser.role);
    if (callerRole !== 'PLATFORM_ADMIN') {
      showToast('Unauthorized: Only Platform Admins can modify account roles.', 'error');
      return;
    }

    const normRole = normalizeRole(newRole);
    setAccounts((prev) => {
      const next = prev.map((acc) => (acc.id === userId ? { ...acc, role: normRole } : acc));
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(next));
      return next;
    });

    if (currentUser.id === userId) {
      const updatedSelf = { ...currentUser, role: normRole };
      setCurrentUser(updatedSelf);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedSelf));
    }

    showToast(`User role successfully changed to ${getRoleDisplayName(normRole)}.`, 'success');
  };

  // Platform Admin User Management: delete user
  const adminDeleteUser = (userId: string) => {
    const callerRole = normalizeRole(currentUser.role);
    if (callerRole !== 'PLATFORM_ADMIN') {
      showToast('Unauthorized: Only Platform Admins can delete users.', 'error');
      return;
    }

    if (currentUser.id === userId) {
      showToast('Cannot delete your own active administrator account.', 'error');
      return;
    }

    setAccounts((prev) => {
      const next = prev.filter((acc) => acc.id !== userId);
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(next));
      return next;
    });

    showToast('User account removed.', 'info');
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
        accounts,
        switchDemoPersona,
        switchRole,
        loginUser,
        logoutUser,
        updateUserProfile,
        adminUpdateUserRole,
        adminDeleteUser,
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
        userLocation,
        setUserLocation,
        searchRadiusKm,
        setSearchRadiusKm,
        bookingDate,
        setBookingDate,
        bookingTime,
        setBookingTime,
        bookingPartySize,
        setBookingPartySize,
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
