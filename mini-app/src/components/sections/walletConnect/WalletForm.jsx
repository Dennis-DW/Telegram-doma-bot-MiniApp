import React from 'react';
import { Card, Button, Spinner } from '../../ui';
import { Wallet, AlertCircle } from 'lucide-react';

const WalletForm = ({ loading, error, onConnect, onClearError }) => {
  return (
    <Card className="max-w-md mx-auto p-6">
      <div className="text-center">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to Connect?
          </h2>
          <p className="text-gray-600">
            Click the button below to connect your wallet and start managing domains.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
            <button
              onClick={onClearError}
              className="text-xs text-red-600 hover:text-red-800 underline mt-1"
            >
              Dismiss
            </button>
          </div>
        )}

        <Button
          onClick={onConnect}
          loading={loading}
          icon={Wallet}
          size="large"
          className="w-full"
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </Button>

        <div className="mt-4 text-xs text-gray-500">
          <p>Supported wallets: MetaMask, WalletConnect, and more</p>
          <p>Make sure you're connected to the Doma testnet</p>
        </div>
      </div>
    </Card>
  );
};

export default WalletForm; 