import { useState, useEffect } from 'react';
import telegramApp from '../../../utils/telegram';

export const useDashboard = (blockchain) => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expiring: 0,
    expired: 0
  });

  useEffect(() => {
    if (blockchain) {
      loadUserDomains();
    }
  }, [blockchain]);

  const loadUserDomains = async () => {
    try {
      setLoading(true);
      const address = await blockchain.signer.getAddress();
      
      // Mock domains - in real implementation, fetch from contract
      const mockDomains = [
        {
          tokenId: 1,
          sld: 'example',
          tld: 'doma',
          owner: address,
          expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
          isLocked: false
        },
        {
          tokenId: 2,
          sld: 'test',
          tld: 'doma',
          owner: address,
          expiresAt: Date.now() - 24 * 60 * 60 * 1000,
          isLocked: true
        }
      ];
      
      setDomains(mockDomains);
      calculateStats(mockDomains);
    } catch (error) {
      console.error('Failed to load domains:', error);
      telegramApp.showAlert('Failed to load your domains');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (domainList) => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    
    const stats = {
      total: domainList.length,
      active: domainList.filter(d => d.expiresAt > now).length,
      expiring: domainList.filter(d => d.expiresAt > now && d.expiresAt < now + thirtyDays).length,
      expired: domainList.filter(d => d.expiresAt <= now).length
    };
    
    setStats(stats);
  };

  const getDomainStatus = (expiresAt) => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    
    if (expiresAt <= now) {
      return { status: 'expired', icon: 'AlertCircle', variant: 'danger' };
    } else if (expiresAt < now + thirtyDays) {
      return { status: 'expiring', icon: 'Clock', variant: 'warning' };
    } else {
      return { status: 'active', icon: 'CheckCircle', variant: 'success' };
    }
  };

  const formatExpiryDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const refreshDomains = () => {
    loadUserDomains();
  };

  return {
    domains,
    loading,
    stats,
    getDomainStatus,
    formatExpiryDate,
    refreshDomains
  };
}; 