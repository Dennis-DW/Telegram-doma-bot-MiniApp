import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import telegramApp from './utils/telegram';
import { useSystem } from './hooks/useSystem';
import { useEvents } from './hooks/useEvents';
import {
  HeaderSection,
  EventDashboardSection,
  EventListSection,
  NotificationSettingsSection,
  LoadingSection
} from './components/sections';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const { isHealthy, checkHealth } = useSystem();
  const { events, stats, loading: eventsLoading, error: eventsError } = useEvents();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing Doma Event Tracker...');
      setIsLoading(true);
      
      // Get Telegram user info
      const tgUser = telegramApp.getUser();
      console.log('Telegram user:', tgUser);
      setUser(tgUser);
      
      // Check API health
      try {
        await checkHealth();
        setApiStatus('connected');
        console.log('✅ API connection successful');
      } catch (error) {
        setApiStatus('error');
        console.error('❌ API connection failed:', error);
      }
      
      // Send app initialization data to bot
      telegramApp.sendData({
        action: 'app_initialized',
        user: tgUser,
        apiStatus: apiStatus,
        timestamp: new Date().toISOString()
      });
      
      console.log('App initialization complete');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setApiStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen
  if (isLoading) {
    return <LoadingSection message="Loading Doma Event Tracker..." />;
  }

  // Show API error screen
  if (apiStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connection Error</h2>
            <p className="text-gray-600 mb-6">
              Unable to connect to the Doma Event Tracker API. Please check your connection and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Debug: Show API status and data
  console.log('API Status:', apiStatus);
  console.log('Events loaded:', events.length);
  console.log('Stats:', stats);
  console.log('Events loading:', eventsLoading);
  console.log('Events error:', eventsError);

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <HeaderSection user={user} apiStatus={apiStatus} />
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Debug Info</h3>
                <div className="mt-2 text-sm">
                  <p><strong>API Status:</strong> {apiStatus}</p>
                  <p><strong>Events Loaded:</strong> {events.length}</p>
                  <p><strong>Events Loading:</strong> {eventsLoading ? 'Yes' : 'No'}</p>
                  <p><strong>Events Error:</strong> {eventsError || 'None'}</p>
                  <p><strong>Stats:</strong> {stats ? `${stats.totalEvents} total events` : 'Not loaded'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <main>
          <Routes>
            <Route path="/" element={<EventDashboardSection />} />
            
            <Route path="/events/:eventType" element={<EventListSection />} />
            
            <Route path="/settings" element={<NotificationSettingsSection />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App; 