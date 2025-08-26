import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import telegramApp from './utils/telegram';
import { initializeBlockchain } from './config/blockchain';
import {
  HeaderSection,
  DashboardSection,
  DomainMintSection,
  DomainManageSection,
  WalletConnectSection,
  LoadingSection
} from './components/sections';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blockchain, setBlockchain] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('Initializing app...');
      setIsLoading(true);
      
      // Get Telegram user info
      const tgUser = telegramApp.getUser();
      console.log('Telegram user:', tgUser);
      setUser(tgUser);
      
      // Check if wallet is already connected
      if (typeof window.ethereum !== 'undefined') {
        console.log('Ethereum provider found');
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        console.log('Current accounts:', accounts);
        if (accounts.length > 0) {
          await connectWallet();
        }
      } else {
        console.log('No Ethereum provider found');
      }
      
      console.log('App initialization complete');
    } catch (error) {
      console.error('Failed to initialize app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      const blockchainInstance = await initializeBlockchain();
      setBlockchain(blockchainInstance);
      setIsConnected(true);
      
      // Hide main button after connection
      telegramApp.hideMainButton();
      
      // Send connection data to bot
      telegramApp.sendData({
        action: 'wallet_connected',
        address: await blockchainInstance.signer.getAddress()
      });
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      telegramApp.showAlert('Failed to connect wallet: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setBlockchain(null);
    setIsConnected(false);
    telegramApp.showMainButton();
    
    // Send disconnection data to bot
    telegramApp.sendData({
      action: 'wallet_disconnected'
    });
  };

  // Listen for wallet connection events
  useEffect(() => {
    const handleConnectWallet = () => {
      connectWallet();
    };

    window.addEventListener('connectWallet', handleConnectWallet);
    
    return () => {
      window.removeEventListener('connectWallet', handleConnectWallet);
    };
  }, []);

  if (isLoading) {
    return <LoadingSection message="Loading Doma Manager..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <HeaderSection 
          user={user} 
          isConnected={isConnected} 
          onDisconnect={disconnectWallet}
          blockchain={blockchain}
        />
        
        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                isConnected ? (
                  <DashboardSection blockchain={blockchain} />
                ) : (
                  <WalletConnectSection onConnect={connectWallet} />
                )
              } 
            />
            
            <Route 
              path="/mint" 
              element={
                isConnected ? (
                  <DomainMintSection blockchain={blockchain} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            
            <Route 
              path="/manage" 
              element={
                isConnected ? (
                  <DomainManageSection blockchain={blockchain} />
                ) : (
                  <Navigate to="/" replace />
                )
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App; 