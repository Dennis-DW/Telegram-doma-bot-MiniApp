import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge, Spinner, Button } from '../../ui';
import { Clock, CheckCircle, AlertCircle, Lock, Unlock, Globe, Plus } from 'lucide-react';

const DomainsList = ({ domains, loading, getDomainStatus, formatExpiryDate }) => {
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">No domains yet</h3>
        <p className="text-gray-600 mb-4">
          Start building your domain portfolio by minting your first domain.
        </p>
        <Link to="/mint">
          <Button icon={Plus} size="medium">
            Mint Your First Domain
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {domains.map((domain) => {
        const status = getDomainStatus(domain.expiresAt);
        const StatusIcon = status.icon === 'Clock' ? Clock : 
                          status.icon === 'CheckCircle' ? CheckCircle : AlertCircle;

        return (
          <Card key={domain.tokenId} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
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
                <div className="text-sm text-gray-600">
                  <div>Token ID: {domain.tokenId}</div>
                  <div>Expires: {formatExpiryDate(domain.expiresAt)}</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link to={`/manage?domain=${domain.tokenId}`}>
                  <Button size="small" variant="outline">
                    Manage
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DomainsList; 