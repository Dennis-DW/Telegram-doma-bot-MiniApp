import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Badge } from '../ui';
import { useEvents } from '../../hooks/useEvents';

const EventListSection = () => {
  const { eventType } = useParams();
  const { events, loading, error, refreshEvents, userSettings, allEvents } = useEvents(eventType, 50);

  const eventConfig = {
    minting: {
      title: '✨ Domain Minting Events',
      icon: '✨',
      color: 'blue',
      description: 'New domains minted on the Doma network'
    },
    transfers: {
      title: '🔄 Domain Transfer Events',
      icon: '🔄',
      color: 'green',
      description: 'Domain transfer activities'
    },
    renewals: {
      title: '♻️ Domain Renewal Events',
      icon: '♻️',
      color: 'green',
      description: 'Domain renewal activities'
    },
    burning: {
      title: '🔥 Domain Burning Events',
      icon: '🔥',
      color: 'red',
      description: 'Domain deletion events'
    },
    locks: {
      title: '🔒 Lock Status Events',
      icon: '🔒',
      color: 'purple',
      description: 'Domain lock/unlock activities'
    },
    registrar: {
      title: '🏢 Registrar Change Events',
      icon: '🏢',
      color: 'orange',
      description: 'Registrar updates'
    },
    metadata: {
      title: '📝 Metadata Update Events',
      icon: '📝',
      color: 'teal',
      description: 'Domain metadata changes'
    }
  };

  const config = eventConfig[eventType] || {
    title: '📢 Events',
    icon: '📢',
    color: 'gray',
    description: 'Domain events'
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  const formatDomain = (event) => {
    if (event.domain) return event.domain;
    if (event.args?.sld && event.args?.tld) {
      return `${event.args.sld}.${event.args.tld}`;
    }
    return 'N/A';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getEventIcon = (eventType) => {
    const iconMap = {
      'OwnershipTokenMinted': '✨',
      'Transfer': '🔄',
      'NameTokenRenewed': '♻️',
      'NameTokenBurned': '🔥',
      'LockStatusChanged': '🔒',
      'RegistrarChanged': '🏢',
      'MetadataUpdated': '📝'
    };
    return iconMap[eventType] || '📢';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold mb-2">Error Loading Events</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={refreshEvents}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </Card>
        </div>
      </div>
    );
  }

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
              {config.title}
            </h1>
            <p className="text-lg text-gray-600">
              {config.description}
            </p>
            {userSettings && allEvents && events.length !== allEvents.length && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  🔍 Showing {events.length} of {allEvents.length} events based on your notification preferences
                </p>
              </div>
            )}
          </div>
        </div>

        {events.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
            <p className="text-gray-600">
              No {eventType} events have occurred yet. Check back later!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id || event.txHash} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{getEventIcon(event.type)}</span>
                      <h3 className="text-lg font-semibold">{formatDomain(event)}</h3>
                      <Badge 
                        color={getStatusColor(event.status)} 
                        className="ml-3"
                      >
                        {event.status || 'completed'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Owner:</span> {formatAddress(event.owner || event.args?.to)}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {formatTimestamp(event.timestamp)}
                      </div>
                      <div>
                        <span className="font-medium">Block:</span> {event.blockNumber || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Token ID:</span> {formatAddress(event.tokenId || event.args?.tokenId)}
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">Transaction:</span> {formatAddress(event.txHash)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <button 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      onClick={() => {
                        // Open transaction in explorer
                        const explorerUrl = `https://explorer-testnet.doma.xyz/tx/${event.txHash}`;
                        window.open(explorerUrl, '_blank');
                      }}
                    >
                      View on Explorer
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button 
            onClick={refreshEvents}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-4"
          >
            Refresh Events
          </button>
          <p className="text-gray-600 mt-4">
            Events are updated in real-time. Click refresh to see the latest activity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventListSection; 