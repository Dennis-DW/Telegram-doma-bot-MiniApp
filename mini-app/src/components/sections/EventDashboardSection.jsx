import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui';
import { useEvents } from '../../hooks/useEvents';

const EventDashboardSection = () => {
  const { stats, loading, userSettings, events, allEvents } = useEvents();

  const eventTypes = [
    {
      key: 'minting',
      title: 'Domain Minting',
      icon: '✨',
      color: 'blue',
      description: 'Get notified when new domains are minted',
      link: '/events/minting'
    },
    {
      key: 'transfers',
      title: 'Domain Transfers',
      icon: '🔄',
      color: 'green',
      description: 'Track domain transfer activities',
      link: '/events/transfers'
    },
    {
      key: 'renewals',
      title: 'Domain Renewals',
      icon: '♻️',
      color: 'green',
      description: 'Track domain renewal activities',
      link: '/events/renewals'
    },
    {
      key: 'burning',
      title: 'Domain Burning',
      icon: '🔥',
      color: 'red',
      description: 'Monitor domain deletion events',
      link: '/events/burning'
    },
    {
      key: 'locks',
      title: 'Lock Status',
      icon: '🔒',
      color: 'purple',
      description: 'Track domain lock/unlock events',
      link: '/events/locks'
    },
    {
      key: 'registrar',
      title: 'Registrar Changes',
      icon: '🏢',
      color: 'orange',
      description: 'Monitor registrar updates',
      link: '/events/registrar'
    }
  ];

  const getEventCount = (type) => {
    if (!stats?.eventTypes) return 0;
    const typeMap = {
      minting: 'OwnershipTokenMinted',
      transfers: 'Transfer',
      renewals: 'NameTokenRenewed',
      burning: 'NameTokenBurned',
      locks: 'LockStatusChanged',
      registrar: 'RegistrarChanged'
    };
    return stats.eventTypes[typeMap[type]] || 0;
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
            📢 Doma Event Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-600 px-2">
            Monitor and manage domain events across the Doma network
          </p>
          {userSettings && allEvents && events.length !== allEvents.length && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                🔍 Showing {events.length} of {allEvents.length} events based on your notification preferences
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {eventTypes.map((eventType) => (
            <Card key={eventType.key} className="text-center p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{eventType.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{eventType.title}</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm">
                {eventType.description}
              </p>
              <div className="mb-3 sm:mb-4">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  {getEventCount(eventType.key)}
                </span>
                <span className="text-sm text-gray-500 ml-1">events</span>
              </div>
              <Link 
                to={eventType.link}
                className={`inline-block bg-${eventType.color}-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-${eventType.color}-700 transition-colors text-sm sm:text-base w-full sm:w-auto`}
              >
                View Events
              </Link>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">📊 Quick Stats</h3>
            {loading ? (
              <div className="space-y-3">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm sm:text-base">Total Events:</span>
                  <span className="font-semibold text-sm sm:text-base">{stats?.totalEvents || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm sm:text-base">Events Today:</span>
                  <span className="font-semibold text-sm sm:text-base">{stats?.eventsToday || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm sm:text-base">Active Subscribers:</span>
                  <span className="font-semibold text-sm sm:text-base">{stats?.activeSubscribers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm sm:text-base">Network Status:</span>
                  <span className="font-semibold text-green-600 text-sm sm:text-base">
                    {stats?.networkStatus || 'Active'}
                  </span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">⚙️ Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                to="/settings" 
                className="block w-full bg-gray-100 text-gray-800 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm sm:text-base"
              >
                Manage Notifications
              </Link>
              <button 
                className="block w-full bg-green-100 text-green-800 px-3 sm:px-4 py-2 rounded-lg hover:bg-green-200 transition-colors text-center text-sm sm:text-base"
                onClick={() => {
                  // Refresh events
                  window.location.reload();
                }}
              >
                Refresh Events
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDashboardSection; 