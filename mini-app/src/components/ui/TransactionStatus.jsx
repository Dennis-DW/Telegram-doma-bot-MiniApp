import React from 'react';
import { CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';

const TransactionStatus = ({ 
  status, 
  message, 
  txHash, 
  receipt,
  onClose,
  className = "" 
}) => {
  if (!status) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-blue-600" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getTransactionUrl = (hash) => {
    if (!hash) return null;
    return `https://explorer.doma.com/tx/${hash}`;
  };

  const formatTransactionHash = (hash) => {
    if (!hash) return '';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'pending':
        return 'Transaction in Progress';
      case 'success':
        return 'Transaction Successful';
      case 'error':
        return 'Transaction Failed';
      default:
        return 'Transaction Status';
    }
  };

  return (
    <div className={`mt-4 p-4 rounded-lg border ${getStatusColor()} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getStatusIcon()}
          <div className="flex-1">
            <h4 className="font-medium mb-1">{getStatusTitle()}</h4>
            <p className="text-sm mb-2">{message}</p>
            
            {txHash && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-mono bg-white/50 px-2 py-1 rounded">
                  {formatTransactionHash(txHash)}
                </span>
                <a 
                  href={getTransactionUrl(txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 underline"
                >
                  <ExternalLink size={12} />
                  <span>View on Explorer</span>
                </a>
              </div>
            )}
            
            {receipt && status === 'success' && (
              <div className="mt-2 text-xs text-green-700">
                <div>Block: {receipt.blockNumber}</div>
                <div>Gas Used: {receipt.gasUsed?.toString() || 'N/A'}</div>
              </div>
            )}
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 ml-2"
          >
            ×
          </button>
        )}
      </div>
      
      {/* Progress indicator for pending transactions */}
      {status === 'pending' && (
        <div className="mt-3">
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            Waiting for blockchain confirmation...
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus; 