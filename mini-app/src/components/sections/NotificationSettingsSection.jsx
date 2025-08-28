import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../ui';
import { useSubscription } from '../../hooks/useSubscription';

const NotificationSettingsSection = () => {
  const {
    subscriptionStatus,
    settings,
    loading,
    error,
    subscribe,
    unsubscribe,
    updateSettings,
    toggleEventType,
    toggleNotifications,
    refresh
  } = useSubscription();

  const [message, setMessage] = useState('');

  useEffect(() => {
    // Refresh subscription status on component mount
    refresh();
  }, [refresh]);

  useEffect(() => {
    // Clear message after 5 seconds
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubscribe = async () => {
    try {
      await subscribe();
      setMessage('✅ Successfully subscribed to event notifications!');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      setMessage('❌ Failed to subscribe. Please try again.');
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unsubscribe();
      setMessage('✅ Successfully unsubscribed from event notifications.');
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      setMessage('❌ Failed to unsubscribe. Please try again.');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await updateSettings(settings);
      setMessage('✅ Notification settings updated successfully!');
    } catch (error) {
      console.error('Failed to update settings:', error);
      setMessage('❌ Failed to update settings. Please try again.');
    }
  };

  const eventTypes = [
    {
      key: 'minting',
      label: 'Domain Minting',
      icon: '✨',
      description: 'New domains being minted'
    },
    {
      key: 'transfers',
      label: 'Domain Transfers',
      icon: '🔄',
      description: 'Domains being transferred between addresses'
    },
    {
      key: 'renewals',
      label: 'Domain Renewals',
      icon: '♻️',
      description: 'Domains being renewed'
    },
    {
      key: 'burning',
      label: 'Domain Burning',
      icon: '🔥',
      description: 'Domains being deleted/burned'
    },
    {
      key: 'locks',
      label: 'Lock Status Changes',
      icon: '🔒',
      description: 'Domain lock/unlock events'
    },
    {
      key: 'registrar',
      label: 'Registrar Changes',
      icon: '🏢',
      description: 'Registrar updates'
    },
    {
      key: 'metadata',
      label: 'Metadata Updates',
      icon: '📝',
      description: 'Domain metadata changes'
    }
  ];

  const isSubscribed = subscriptionStatus?.subscribed || false;
  const totalSubscribers = subscriptionStatus?.totalSubscribers || 0;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Dashboard
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ⚙️ Notification Settings
            </h1>
            <p className="text-lg text-gray-600">
              Manage your event notification preferences
            </p>
          </div>
        </div>

        {message && (
          <Card className="p-4 mb-6">
            <p className={`text-center ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          </Card>
        )}

        {error && (
          <Card className="p-4 mb-6">
            <p className="text-center text-red-600">
              ❌ Error: {error}
            </p>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">📱 Subscription Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Status:</span>
                <span className={`font-semibold ${isSubscribed ? 'text-green-600' : 'text-red-600'}`}>
                  {isSubscribed ? 'Subscribed' : 'Not Subscribed'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Subscribers:</span>
                <span className="font-semibold text-blue-600">
                  {totalSubscribers}
                </span>
              </div>
              
              <div className="space-y-3">
                {isSubscribed ? (
                  <Button
                    onClick={handleUnsubscribe}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    {loading ? 'Unsubscribing...' : 'Unsubscribe from All Events'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? 'Subscribing...' : 'Subscribe to All Events'}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">🔔 Event Preferences</h3>
            <div className="space-y-4">
              {eventTypes.map((eventType) => (
                <div key={eventType.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{eventType.icon}</span>
                    <div>
                      <h4 className="font-medium">{eventType.label}</h4>
                      <p className="text-sm text-gray-600">{eventType.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings?.eventTypes?.[eventType.key] || false}
                      onChange={() => toggleEventType(eventType.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
              
              <Button
                onClick={handleSaveSettings}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">ℹ️ How It Works</h3>
            <div className="space-y-3 text-gray-600">
              <p>
                • <strong>Subscribe/Unsubscribe:</strong> Control whether you receive any event notifications
              </p>
              <p>
                • <strong>Event Preferences:</strong> Choose which specific event types you want to be notified about
              </p>
              <p>
                • <strong>Real-time Updates:</strong> Notifications are sent immediately when events occur on the blockchain
              </p>
              <p>
                • <strong>Telegram Integration:</strong> All notifications are sent directly to your Telegram chat
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsSection; 