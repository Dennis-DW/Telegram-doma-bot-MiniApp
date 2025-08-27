import React from 'react';
import { Wallet } from 'lucide-react';

const WalletHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <Wallet className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Connect Your Wallet</h1>
      <p className="text-lg text-gray-600 max-w-md mx-auto">
        Connect your Web3 wallet to start managing your domains on the Doma blockchain
      </p>
    </div>
  );
};

export default WalletHeader; 