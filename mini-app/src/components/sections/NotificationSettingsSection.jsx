import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../ui';
import { useAppDispatch } from '../../store/hooks';
import { 
  useSubscriptionStatus, 
  useSubscriptionSettings, 
  useSubscriptionLoading 
} from '../../store/hooks';
import { 
  fetchSubscriptionStatus, 
  subscribeUser, 
  unsubscribeUser, 
  updateUserSettings,
  toggleEventType as toggleEventTypeAction
} from '../../store/slices/subscriptionSlice';

const NotificationSettingsSection = () => {
  const dispatch = useAppDispatch();
  const subscriptionStatus = useSubscriptionStatus();
  const settings = useSubscriptionSettings();
  const loading = useSubscriptionLoading();

  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch subscription status on component mount
    dispatch(fetchSubscriptionStatus());
    
    // Set up periodic refresh every 30 seconds to keep status updated
    const interval = setInterval(() => {
      dispatch(fetchSubscriptionStatus());
    }, 30000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    // Clear message after 5 seconds
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubscribe = async () => {
    try {
      const result = await dispatch(subscribeUser()).unwrap();
      setMessage('✅ Successfully subscribed to event notifications!');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      setMessage('❌ Failed to subscribe. Please try again.');
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const result = await dispatch(unsubscribeUser()).unwrap();
      setMessage('✅ Successfully unsubscribed from event notifications.');
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      setMessage('❌ Failed to unsubscribe. Please try again.');
    }
  };

  const handleSaveSettings = async () => {
    try {
      const result = await dispatch(updateUserSettings(settings)).unwrap();
      setMessage('✅ Notification settings updated successfully! Events will be filtered based on your preferences.');
    } catch (error) {
      console.error('Failed to update settings:', error);
      setMessage('❌ Failed to update settings. Please try again.');
    }
  };

  const handleToggleEventType = (eventType) => {
    dispatch(toggleEventTypeAction({ eventType }));
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
    <div className="container mx-auto px-4 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-3 sm:mb-4 text-sm sm:text-base"
          >
            ← Back to Dashboard
          </Link>
          
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              ⚙️ Notification Settings
            </h1>
            <p className="text-base sm:text-lg text-gray-600 px-2">
              Manage your event notification preferences
            </p>
          </div>
        </div>

        {message && (
          <Card className="p-3 sm:p-4 mb-4 sm:mb-6">
            <p className={`text-center text-sm sm:text-base ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          </Card>
        )}



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">📱 Subscription Status</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm sm:text-base">Current Status:</span>
                <span className={`font-semibold text-sm sm:text-base ${isSubscribed ? 'text-green-600' : 'text-red-600'}`}>
                  {isSubscribed ? 'Subscribed' : 'Not Subscribed'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm sm:text-base">Total Subscribers:</span>
                <span className="font-semibold text-blue-600 text-sm sm:text-base">
                  {totalSubscribers}
                </span>
              </div>
              
              <div className="space-y-3">
                {isSubscribed ? (
                  <Button
                    onClick={handleUnsubscribe}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base py-2 sm:py-3"
                  >
                    {loading ? 'Unsubscribing...' : '🔕 Unsubscribe from All Events'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2 sm:py-3"
                  >
                    {loading ? 'Subscribing...' : '🔔 Subscribe to All Events'}
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">🔔 Event Preferences</h3>
            <div className="space-y-3 sm:space-y-4">
              {eventTypes.map((eventType) => (
                <div key={eventType.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">{eventType.icon}</span>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm sm:text-base truncate">{eventType.label}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{eventType.description}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-2 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={settings?.eventTypes?.[eventType.key] || false}
                      onChange={() => handleToggleEventType(eventType.key)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
              
              <Button
                onClick={handleSaveSettings}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base py-2 sm:py-3 mt-4"
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-6 sm:mt-8">
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">ℹ️ How It Works</h3>
            <div className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
              <p>
                • <strong>Subscribe/Unsubscribe:</strong> Control whether you receive any event notifications
              </p>
              <p>
                • <strong>Event Preferences:</strong> Choose which specific event types you want to be notified about
              </p>
              <p>
                • <strong>Real-time Updates:</strong> Notifications are sent every 30 minutes when events occur
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