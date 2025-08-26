import React from 'react';
import { Wallet, Shield, Zap } from 'lucide-react';
import { Card, Button } from '../ui';

const WalletConnectSection = ({ onConnect }) => {
  const handleConnect = async () => {
    try {
      await onConnect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">🔗 Connect Your Wallet</h2>
        <p className="text-gray-600">
          Connect your wallet to manage Doma domains and receive real-time notifications.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover>
          <div className="text-center">
            <Wallet size={32} className="mx-auto mb-3 text-blue-600" />
            <h3 className="font-semibold text-gray-900 mb-2">Manage Domains</h3>
            <p className="text-sm text-gray-600">
              Mint, renew, transfer, and manage your Doma domains directly from Telegram.
            </p>
          </div>
        </Card>
        
        <Card hover>
          <div className="text-center">
            <Shield size={32} className="mx-auto mb-3 text-green-600" />
            <h3 className="font-semibold text-gray-900 mb-2">Secure Transactions</h3>
            <p className="text-sm text-gray-600">
              All transactions are secured by your wallet and executed on the Doma blockchain.
            </p>
          </div>
        </Card>
        
        <Card hover>
          <div className="text-center">
            <Zap size={32} className="mx-auto mb-3 text-yellow-600" />
            <h3 className="font-semibold text-gray-900 mb-2">Real-time Updates</h3>
            <p className="text-sm text-gray-600">
              Get instant notifications about domain events, expirations, and transfers.
            </p>
          </div>
        </Card>
      </div>
      
      <div className="text-center">
        <Button 
          onClick={handleConnect}
          size="large"
          icon={Wallet}
        >
          Connect Wallet
        </Button>
      </div>
      
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">📋 Supported Actions</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-lg">✨</span>
            <span className="text-gray-700">Mint new domains</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg">♻️</span>
            <span className="text-gray-700">Renew existing domains</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg">🔄</span>
            <span className="text-gray-700">Transfer domain ownership</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg">🔐</span>
            <span className="text-gray-700">Lock/unlock transfers</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-lg">🔥</span>
            <span className="text-gray-700">Burn domains</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletConnectSection; 