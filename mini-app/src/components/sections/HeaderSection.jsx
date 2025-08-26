import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, User, LogOut, Home, Plus, Settings } from 'lucide-react';
import telegramApp from '../../utils/telegram';

const HeaderSection = ({ user, isConnected, onDisconnect, blockchain }) => {
  const location = useLocation();
  const [walletAddress, setWalletAddress] = React.useState('');

  React.useEffect(() => {
    if (blockchain?.signer) {
      getWalletAddress();
    }
  }, [blockchain]);

  const getWalletAddress = async () => {
    try {
      const address = await blockchain.signer.getAddress();
      setWalletAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
    } catch (error) {
      console.error('Failed to get wallet address:', error);
    }
  };

  const handleDisconnect = () => {
    telegramApp.showConfirm(
      'Are you sure you want to disconnect your wallet?',
      (confirmed) => {
        if (confirmed) {
          onDisconnect();
        }
      }
    );
  };

  return (
    <header className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">🏠 Doma Manager</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected && (
              <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                <Wallet size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{walletAddress}</span>
                <button 
                  onClick={handleDisconnect}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Disconnect Wallet"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
            
            {user && (
              <div className="flex items-center space-x-2 text-gray-500">
                <User size={16} />
                <span className="text-sm">
                  {user.first_name} {user.last_name}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {isConnected && (
          <nav className="flex justify-center space-x-1 mt-3">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Home size={16} />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/mint" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/mint' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Plus size={16} />
              <span>Mint Domain</span>
            </Link>
            
            <Link 
              to="/manage" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/manage' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings size={16} />
              <span>Manage</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default HeaderSection; 