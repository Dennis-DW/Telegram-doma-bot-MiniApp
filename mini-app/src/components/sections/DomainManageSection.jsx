import React, { useState, useEffect } from 'react';
import { RefreshCw, Lock, Unlock, RotateCcw, Trash2 } from 'lucide-react';
import { generateCorrelationId } from '../../config/blockchain';
import telegramApp from '../../utils/telegram';
import { Card, Button, Badge, Spinner } from '../ui';

const DomainManageSection = ({ blockchain }) => {
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
      console.error('Failed to toggle lock:', error);
      telegramApp.showAlert('Failed to toggle lock: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBurn = async (domain) => {
    telegramApp.showConfirm(
      `Are you sure you want to burn ${domain.sld}.${domain.tld}? This action cannot be undone.`,
      async (confirmed) => {
        if (confirmed) {
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
        }
      }
    );
  };

  const getDomainStatus = (expiresAt) => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    
    if (expiresAt <= now) {
      return { status: 'expired', variant: 'danger' };
    } else if (expiresAt < now + thirtyDays) {
      return { status: 'expiring', variant: 'warning' };
    } else {
      return { status: 'active', variant: 'success' };
    }
  };

  const formatExpiryDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Spinner size="large" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading your domains...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">⚙️ Manage Domains</h2>
        <Button
          onClick={loadDomains}
          disabled={loading}
          icon={RefreshCw}
          variant="outline"
          size="small"
        >
          Refresh
        </Button>
      </div>
      
      {domains.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <h3 className="font-semibold text-gray-900 mb-2">No domains found</h3>
            <p className="text-gray-600">You don't have any domains to manage yet.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {domains.map((domain) => {
            const status = getDomainStatus(domain.expiresAt);
            return (
              <Card key={domain.tokenId}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">
                      {domain.sld}.{domain.tld}
                    </div>
                    <div className="text-sm text-gray-600 space-x-2">
                      <span>Token ID: {domain.tokenId}</span>
                      <span>•</span>
                      <span>Expires: {formatExpiryDate(domain.expiresAt)}</span>
                      {domain.isLocked && <span>• 🔒 Locked</span>}
                    </div>
                    <div className="mt-2">
                      <Badge variant={status.variant} size="small">
                        {status.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {status.status === 'expired' ? (
                      <Button
                        onClick={() => handleRenew(domain)}
                        disabled={actionLoading}
                        icon={RotateCcw}
                        variant="primary"
                        size="small"
                      >
                        Renew
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleRenew(domain)}
                        disabled={actionLoading}
                        icon={RotateCcw}
                        variant="secondary"
                        size="small"
                      >
                        Renew
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => handleToggleLock(domain)}
                      disabled={actionLoading}
                      icon={domain.isLocked ? Unlock : Lock}
                      variant={domain.isLocked ? "secondary" : "primary"}
                      size="small"
                    >
                      {domain.isLocked ? 'Unlock' : 'Lock'}
                    </Button>
                    
                    <Button
                      onClick={() => handleBurn(domain)}
                      disabled={actionLoading}
                      icon={Trash2}
                      variant="danger"
                      size="small"
                    >
                      Burn
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">📋 Action Guide</h3>
        <div className="space-y-4">
          <div className="flex space-x-3">
            <div className="text-lg">♻️</div>
            <div>
              <h4 className="font-medium text-gray-900">Renew Domain</h4>
              <p className="text-sm text-gray-600">Extend the expiration date of your domain</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="text-lg">🔐</div>
            <div>
              <h4 className="font-medium text-gray-900">Lock/Unlock</h4>
              <p className="text-sm text-gray-600">Prevent or allow domain transfers</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="text-lg">🔥</div>
            <div>
              <h4 className="font-medium text-gray-900">Burn Domain</h4>
              <p className="text-sm text-gray-600">Permanently delete your domain (irreversible)</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DomainManageSection; 