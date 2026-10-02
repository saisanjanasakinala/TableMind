/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp, PROTECTED_VIEWS } from './context/AppContext';
import { normalizeRole, getRoleDisplayName, UserRole } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { ShieldAlert } from 'lucide-react';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { TableBookingPage } from './pages/TableBookingPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';
import { OwnerTablesPage } from './pages/OwnerTablesPage';
import { OwnerReservationsPage } from './pages/OwnerReservationsPage';
import { OwnerAnalyticsPage } from './pages/OwnerAnalyticsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthPage } from './pages/AuthPage';

const AccessDeniedView: React.FC<{
  message: string;
  userRole: UserRole;
  onGoHome: () => void;
}> = ({ message, userRole, onGoHome }) => (
  <div className="min-h-[70vh] flex items-center justify-center p-6">
    <div className="max-w-md w-full p-8 rounded-3xl bg-stone-900 border border-stone-800 text-center shadow-2xl">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-white font-display">Access Restricted</h2>
      <p className="mt-2 text-xs text-stone-300 leading-relaxed">{message}</p>
      <div className="mt-4 p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] text-stone-400">
        Your authenticated account role is{' '}
        <span className="font-semibold text-amber-400">{getRoleDisplayName(userRole)}</span>.
      </div>
      <button
        onClick={onGoHome}
        className="mt-6 w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
      >
        Go to My Authorized Dashboard →
      </button>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { activeView, currentUser, navigate, showToast } = useApp();
  const userRole = normalizeRole(currentUser.role);
  const rule = PROTECTED_VIEWS[activeView];
  const isUnauthorized = Boolean(rule && !rule.allowedRoles.includes(userRole));

  useEffect(() => {
    if (isUnauthorized && rule) {
      const fallback = rule.getFallbackView(userRole);
      showToast(rule.deniedMessage, 'error');
      navigate(fallback);
    }
  }, [isUnauthorized, rule, userRole, navigate, showToast]);

  const renderView = () => {
    // Hard security check: never render unauthorized component
    if (isUnauthorized && rule) {
      return (
        <AccessDeniedView
          message={rule.deniedMessage}
          userRole={userRole}
          onGoHome={() => navigate(rule.getFallbackView(userRole))}
        />
      );
    }

    switch (activeView) {
      case 'landing':
        return <LandingPage />;
      case 'discovery':
        return <DiscoveryPage />;
      case 'restaurant-detail':
        return <RestaurantDetailPage />;
      case 'booking':
        return <TableBookingPage />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'confirmation':
        return <ConfirmationPage />;
      case 'customer-dashboard':
        return <CustomerDashboardPage />;
      case 'owner-dashboard':
        return <OwnerDashboardPage />;
      case 'owner-tables':
        return <OwnerTablesPage />;
      case 'owner-reservations':
        return <OwnerReservationsPage />;
      case 'owner-analytics':
        return <OwnerAnalyticsPage />;
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'auth':
        return <AuthPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">{renderView()}</main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
