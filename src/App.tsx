/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

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

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  const renderView = () => {
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
