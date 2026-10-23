import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './i18n';
import { AppStoreProvider } from './store';
import { MainLayout } from './components/layout/MainLayout';

import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { MaterialsPage } from './pages/MaterialsPage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import { ServicesPage } from './pages/ServicesPage';
import { BookingsPage } from './pages/BookingsPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { HandoverPage } from './pages/HandoverPage';
import { FinancePage } from './pages/FinancePage';
import { MaintenancePage } from './pages/MaintenancePage';
import { AdminPage } from './pages/AdminPage';
import { SupportPage } from './pages/SupportPage';

export const App: React.FC = () => {
  return (
    <I18nProvider>
      <AppStoreProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="properties" element={<PropertiesPage />} />
              <Route path="materials" element={<MaterialsPage />} />
              <Route path="materials/cart" element={<CartPage />} />
              <Route path="materials/orders" element={<OrdersPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="services/quotations" element={<BookingsPage />} />
              <Route path="services/bookings" element={<BookingsPage />} />
              <Route path="equipment" element={<EquipmentPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/handover" element={<HandoverPage />} />
              <Route path="finance" element={<FinancePage />} />
              <Route path="maintenance" element={<MaintenancePage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppStoreProvider>
    </I18nProvider>
  );
};

export default App;
