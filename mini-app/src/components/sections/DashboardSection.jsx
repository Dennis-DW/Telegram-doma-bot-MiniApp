import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Settings, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDomainName } from '../../config/blockchain';
import telegramApp from '../../utils/telegram';
import { Card, Badge, Spinner, Button } from '../ui';

const DashboardSection = ({ blockchain }) => {
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
      return { status: 'expired', icon: <AlertCircle size={16} />, variant: 'danger' };
    } else if (expiresAt < now + thirtyDays) {
      return { status: 'expiring', icon: <Clock size={16} />, variant: 'warning' };
    } else {
      return { status: 'active', icon: <CheckCircle size={16} />, variant: 'success' };
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
      {/* Stats Overview */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Your Domains</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.expiring}</div>
            <div className="text-sm text-gray-600">Expiring</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <div className="text-sm text-gray-600">Expired</div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/mint" className="block">
            <Card hover className="text-center">
              <Plus size={24} className="mx-auto mb-2 text-blue-600" />
              <span className="font-medium text-gray-900">Mint Domain</span>
            </Card>
          </Link>
          <Link to="/manage" className="block">
            <Card hover className="text-center">
              <Settings size={24} className="mx-auto mb-2 text-green-600" />
              <span className="font-medium text-gray-900">Manage Domains</span>
            </Card>
          </Link>
        </div>
      </Card>

      {/* Domain List */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">🏠 Your Domains</h3>
        {domains.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="font-semibold text-gray-900 mb-2">No domains found</h3>
            <p className="text-gray-600 mb-4">Start by minting your first domain!</p>
            <Link to="/mint">
              <Button icon={Plus}>
                Mint Domain
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {domains.map((domain) => {
              const status = getDomainStatus(domain.expiresAt);
              return (
                <div key={domain.tokenId} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {formatDomainName(domain.sld, domain.tld)}
                    </div>
                    <div className="text-sm text-gray-600 space-x-2">
                      <span>Token ID: {domain.tokenId}</span>
                      <span>•</span>
                      <span>Expires: {formatExpiryDate(domain.expiresAt)}</span>
                      {domain.isLocked && <span>• 🔒 Locked</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {status.icon}
                    <Badge variant={status.variant} size="small">
                      {status.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">📈 Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex space-x-3">
            <div className="text-lg">✨</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Domain Minted</div>
              <div className="text-sm text-gray-600">example.doma was successfully minted</div>
              <div className="text-xs text-gray-500">2 hours ago</div>
            </div>
          </div>
          <div className="flex space-x-3">
            <div className="text-lg">🔐</div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Transfer Locked</div>
              <div className="text-sm text-gray-600">test.doma transfer lock enabled</div>
              <div className="text-xs text-gray-500">1 day ago</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardSection; 