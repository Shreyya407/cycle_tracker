import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import NavigationShell from './components/layout/NavigationShell';

import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import DailyCheckInPage from './pages/DailyCheckInPage';
import SymptomTrackingPage from './pages/SymptomTrackingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import InsightsPage from './pages/InsightsPage';
import JournalPage from './pages/JournalPage';
import RemindersPage from './pages/RemindersPage';
import SettingsPage from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/join" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Application Shell Routes */}
            <Route
              path="/dashboard"
              element={
                <NavigationShell>
                  <DashboardPage />
                </NavigationShell>
              }
            />
            <Route
              path="/calendar"
              element={
                <NavigationShell>
                  <CalendarPage />
                </NavigationShell>
              }
            />
            <Route
              path="/check-in"
              element={
                <NavigationShell>
                  <DailyCheckInPage />
                </NavigationShell>
              }
            />
            <Route
              path="/symptoms"
              element={
                <NavigationShell>
                  <SymptomTrackingPage />
                </NavigationShell>
              }
            />
            <Route
              path="/analytics"
              element={
                <NavigationShell>
                  <AnalyticsPage />
                </NavigationShell>
              }
            />
            <Route
              path="/insights"
              element={
                <NavigationShell>
                  <InsightsPage />
                </NavigationShell>
              }
            />
            <Route
              path="/journal"
              element={
                <NavigationShell>
                  <JournalPage />
                </NavigationShell>
              }
            />
            <Route
              path="/reminders"
              element={
                <NavigationShell>
                  <RemindersPage />
                </NavigationShell>
              }
            />
            <Route
              path="/settings"
              element={
                <NavigationShell>
                  <SettingsPage />
                </NavigationShell>
              }
            />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
