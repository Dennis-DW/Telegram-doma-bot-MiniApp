import { useState } from 'react';
import { initializeBlockchain } from '../../../config/blockchain';
import telegramApp from '../../../utils/telegram';

export const useWalletConnect = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const blockchainInstance = await initializeBlockchain();
      
      // Send connection data to bot
      telegramApp.sendData({
        action: 'wallet_connected',
        address: await blockchainInstance.signer.getAddress()
      });
      
      return blockchainInstance;
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    connectWallet,
    clearError
  };
}; 