import React from 'react';
import { Card, Badge, Spinner, Button } from '../../ui';
import { RefreshCw, Lock, Unlock, RotateCcw, Trash2, Clock, CheckCircle, AlertCircle, Globe } from 'lucide-react';

const ManageDomainsList = ({ 
  domains, 
  loading, 
  actionLoading, 
  onRenew, 
  onToggleLock, 
  onBurn 
}) => {
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

  if (domains.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Globe className="w-16 h-16 mx-auto text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No domains to manage</h3>
        <p className="text-gray-600">
          You don't have any domains yet. Start by minting your first domain!
        </p>
      </Card>
    );
  }

  const getDomainStatus = (expiresAt) => {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    
    if (expiresAt <= now) {
      return { status: 'expired', icon: AlertCircle, variant: 'danger' };
    } else if (expiresAt < now + thirtyDays) {
      return { status: 'expiring', icon: Clock, variant: 'warning' };
    } else {
      return { status: 'active', icon: CheckCircle, variant: 'success' };
    }
  };

  const formatExpiryDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {domains.map((domain) => {
        const status = getDomainStatus(domain.expiresAt);
        const StatusIcon = status.icon;

        return (
          <Card key={domain.tokenId} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {domain.sld}.{domain.tld}
                  </h3>
                  <Badge variant={status.variant}>
                    <StatusIcon size={14} className="mr-1" />
                    {status.status}
                  </Badge>
                  <Badge variant={domain.isLocked ? 'warning' : 'success'}>
                    {domain.isLocked ? (
                      <>
                        <Lock size={14} className="mr-1" />
                        Locked
                      </>
                    ) : (
                      <>
                        <Unlock size={14} className="mr-1" />
                        Unlocked
                      </>
                    )}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Token ID:</span> {domain.tokenId}
                  </div>
                  <div>
                    <span className="font-medium">Expires:</span> {formatExpiryDate(domain.expiresAt)}
                  </div>
                  <div>
                    <span className="font-medium">Owner:</span> {domain.owner.slice(0, 6)}...{domain.owner.slice(-4)}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                <Button
                  icon={RotateCcw}
                  onClick={() => onRenew(domain)}
                  loading={actionLoading}
                  size="small"
                  variant="outline"
                  disabled={actionLoading}
                >
                  Renew
                </Button>
                
                <Button
                  icon={domain.isLocked ? Unlock : Lock}
                  onClick={() => onToggleLock(domain)}
                  loading={actionLoading}
                  size="small"
                  variant="outline"
                  disabled={actionLoading}
                >
                  {domain.isLocked ? 'Unlock' : 'Lock'}
                </Button>
                
                <Button
                  icon={Trash2}
                  onClick={() => onBurn(domain)}
                  loading={actionLoading}
                  size="small"
                  variant="danger"
                  disabled={actionLoading}
                >
                  Burn
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ManageDomainsList; 