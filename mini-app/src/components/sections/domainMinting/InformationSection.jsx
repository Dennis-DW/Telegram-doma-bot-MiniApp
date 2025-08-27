import React from 'react';
import { Card } from '../../ui';

const InformationSection = () => {
  return (
    <Card>
      <h3 className="font-semibold text-gray-900 mb-4">ℹ️ Important Information</h3>
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <span className="text-lg">🔒</span>
          <span className="text-gray-700">Domains are secured by blockchain technology</span>
        </div>
        <div className="flex items-start space-x-3">
          <span className="text-lg">📱</span>
          <span className="text-gray-700">You'll receive notifications for all domain events</span>
        </div>
        <div className="flex items-start space-x-3">
          <span className="text-lg">⚡</span>
          <span className="text-gray-700">Transactions are processed on the Doma testnet</span>
        </div>
        <div className="flex items-start space-x-3">
          <span className="text-lg">💰</span>
          <span className="text-gray-700">Gas fees apply for blockchain transactions</span>
        </div>
        <div className="flex items-start space-x-3">
          <span className="text-lg">⏱️</span>
          <span className="text-gray-700">Transaction confirmation may take several minutes</span>
        </div>
        <div className="flex items-start space-x-3">
          <span className="text-lg">✅</span>
          <span className="text-gray-700">Real-time transaction status and confirmation</span>
        </div>
        <div className="flex items-start space-x-3">
          <span className="text-lg">🔍</span>
          <span className="text-gray-700">Automatic domain availability checking</span>
        </div>
      </div>
    </Card>
  );
};

export default InformationSection; 