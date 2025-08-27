import React from 'react';
import { WalletHeader, WalletForm, useWalletConnect } from './walletConnect';

const WalletConnectSection = ({ onConnect }) => {
  const { loading, error, connectWallet, clearError } = useWalletConnect();

  const handleConnect = async () => {
    try {
      const blockchainInstance = await connectWallet();
      onConnect(blockchainInstance);
    } catch (error) {
      // Error is already handled in the hook
      console.error('Wallet connection failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <WalletHeader />
        <WalletForm
          loading={loading}
          error={error}
          onConnect={handleConnect}
          onClearError={clearError}
        />
      </div>
    </div>
  );
};

export default WalletConnectSection; 