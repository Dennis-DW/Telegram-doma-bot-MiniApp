import { useState, useEffect } from 'react';
import { generateCorrelationId } from '../../../config/blockchain';
import telegramApp from '../../../utils/telegram';

export const useDomainManage = (blockchain) => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (blockchain) {
      loadDomains();
    }
  }, [blockchain]);

  const loadDomains = async () => {
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
    } catch (error) {
      console.error('Failed to load domains:', error);
      telegramApp.showAlert('Failed to load domains');
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (domain) => {
    try {
      setActionLoading(true);
      const correlationId = generateCorrelationId();
      
      // Simulate renewal transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTxHash = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Send data to bot
      telegramApp.sendData({
        action: 'domain_renewed',
        domain: `${domain.sld}.${domain.tld}`,
        tokenId: domain.tokenId,
        correlationId,
        txHash: mockTxHash
      });

      telegramApp.showAlert(`Domain ${domain.sld}.${domain.tld} renewed successfully!`);
      
      // Reload domains
      await loadDomains();
      
    } catch (error) {
      console.error('Failed to renew domain:', error);
      telegramApp.showAlert('Failed to renew domain: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleLock = async (domain) => {
    try {
      setActionLoading(true);
      const correlationId = generateCorrelationId();
      const newLockStatus = !domain.isLocked;
      
      // Simulate lock/unlock transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTxHash = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Send data to bot
      telegramApp.sendData({
        action: 'lock_status_changed',
        domain: `${domain.sld}.${domain.tld}`,
        tokenId: domain.tokenId,
        isLocked: newLockStatus,
        correlationId,
        txHash: mockTxHash
      });

      telegramApp.showAlert(`Domain ${domain.sld}.${domain.tld} ${newLockStatus ? 'locked' : 'unlocked'} successfully!`);
      
      // Reload domains
      await loadDomains();
      
    } catch (error) {
      console.error('Failed to toggle lock status:', error);
      telegramApp.showAlert('Failed to toggle lock status: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBurn = async (domain) => {
    try {
      setActionLoading(true);
      const correlationId = generateCorrelationId();
      
      // Simulate burn transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTxHash = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Send data to bot
      telegramApp.sendData({
        action: 'domain_burned',
        domain: `${domain.sld}.${domain.tld}`,
        tokenId: domain.tokenId,
        correlationId,
        txHash: mockTxHash
      });

      telegramApp.showAlert(`Domain ${domain.sld}.${domain.tld} burned successfully!`);
      
      // Reload domains
      await loadDomains();
      
    } catch (error) {
      console.error('Failed to burn domain:', error);
      telegramApp.showAlert('Failed to burn domain: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const refreshDomains = () => {
    loadDomains();
  };

  return {
    domains,
    loading,
    actionLoading,
    handleRenew,
    handleToggleLock,
    handleBurn,
    refreshDomains
  };
}; 