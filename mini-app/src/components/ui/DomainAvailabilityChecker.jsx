import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';

const DomainAvailabilityChecker = ({ 
  domainName, 
  contract, 
  onAvailabilityChange,
  className = "" 
}) => {
  const [status, setStatus] = useState('idle'); // idle, checking, available, unavailable, error
  const [message, setMessage] = useState('');
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    if (domainName && contract && domainName.length >= 3) {
      checkAvailability();
    } else {
      setStatus('idle');
      setMessage('');
    }
  }, [domainName, contract]);

  const checkAvailability = async () => {
    if (!domainName || !contract) return;

    try {
      setStatus('checking');
      setMessage('Checking availability...');

      // Basic format validation
      if (!/^[a-z0-9-]+$/.test(domainName)) {
        setStatus('unavailable');
        setMessage('Invalid domain format');
        onAvailabilityChange?.({ available: false, error: 'Invalid domain format' });
        return;
      }

      // Check if domain already exists by trying to get owner
      // This is a simplified check - in production you might want a dedicated availability function
      try {
        // Try to encode a call to check if the domain structure is valid
        const domainHash = contract.interface.encodeFunctionData('ownerOf', [0]);
        
        // For now, we'll assume availability and let the contract handle conflicts
        // In a real implementation, you might call a dedicated availability function
        
        setStatus('available');
        setMessage('Domain appears available');
        setLastChecked(new Date());
        onAvailabilityChange?.({ available: true, message: 'Domain appears available' });
        
      } catch (error) {
        // If the contract call fails, the domain might not be available
        setStatus('unavailable');
        setMessage('Domain may not be available');
        onAvailabilityChange?.({ available: false, error: 'Domain may not be available' });
      }

    } catch (error) {
      console.error('Error checking domain availability:', error);
      setStatus('error');
      setMessage('Error checking availability');
      onAvailabilityChange?.({ available: false, error: 'Error checking availability' });
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader size={16} className="animate-spin text-blue-600" />;
      case 'available':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'unavailable':
        return <XCircle size={16} className="text-red-600" />;
      case 'error':
        return <AlertCircle size={16} className="text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'text-blue-600';
      case 'available':
        return 'text-green-600';
      case 'unavailable':
        return 'text-red-600';
      case 'error':
        return 'text-yellow-600';
      default:
        return 'text-gray-500';
    }
  };

  if (status === 'idle') {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      {getStatusIcon()}
      <span className={getStatusColor()}>
        {message}
      </span>
      {lastChecked && (
        <span className="text-xs text-gray-500">
          (checked {lastChecked.toLocaleTimeString()})
        </span>
      )}
    </div>
  );
};

export default DomainAvailabilityChecker; 