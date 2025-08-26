import React, { useState } from 'react';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { generateCorrelationId } from '../../config/blockchain';
import telegramApp from '../../utils/telegram';
import { Card, Input, Button, Badge } from '../ui';

const DomainMintSection = ({ blockchain }) => {
  const [formData, setFormData] = useState({
    sld: '',
    tld: 'doma',
    duration: '1'
  });
  const [loading, setLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.sld.trim()) {
      telegramApp.showAlert('Please enter a domain name');
      return false;
    }
    
    if (formData.sld.length < 3) {
      telegramApp.showAlert('Domain name must be at least 3 characters');
      return false;
    }
    
    if (!/^[a-z0-9-]+$/.test(formData.sld)) {
      telegramApp.showAlert('Domain name can only contain lowercase letters, numbers, and hyphens');
      return false;
    }
    
    return true;
  };

  const handleMint = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setTransactionStatus({ type: 'pending', message: 'Preparing transaction...' });

      const correlationId = generateCorrelationId();
      
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful transaction
      const mockTxHash = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      setTransactionStatus({
        type: 'success',
        message: `Domain ${formData.sld}.${formData.tld} minted successfully!`,
        txHash: mockTxHash
      });

      // Send data to bot
      telegramApp.sendData({
        action: 'domain_minted',
        domain: `${formData.sld}.${formData.tld}`,
        correlationId,
        txHash: mockTxHash
      });

      // Reset form
      setFormData({
        sld: '',
        tld: 'doma',
        duration: '1'
      });

      telegramApp.showAlert('Domain minted successfully! You will receive notifications about this domain.');

    } catch (error) {
      console.error('Failed to mint domain:', error);
      setTransactionStatus({
        type: 'error',
        message: 'Failed to mint domain: ' + error.message
      });
      telegramApp.showAlert('Failed to mint domain: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (transactionStatus?.type) {
      case 'pending':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">✨ Mint New Domain</h2>
        <p className="text-gray-600">
          Create a new domain on the Doma blockchain. You'll receive notifications about domain events.
        </p>
      </div>

      <Card>
        <form onSubmit={(e) => { e.preventDefault(); handleMint(); }} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domain Name
            </label>
            <div className="flex">
              <input
                type="text"
                name="sld"
                value={formData.sld}
                onChange={handleInputChange}
                placeholder="example"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-600 font-medium">
                .{formData.tld}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Top Level Domain
              </label>
              <select
                name="tld"
                value={formData.tld}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="doma">doma</option>
                <option value="test">test</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Years)
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="1">1 Year</option>
                <option value="2">2 Years</option>
                <option value="3">3 Years</option>
                <option value="5">5 Years</option>
                <option value="10">10 Years</option>
              </select>
            </div>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Domain Preview</h4>
            <div className="text-lg font-mono text-blue-700">
              {formData.sld ? `${formData.sld}.${formData.tld}` : 'Enter domain name'}
            </div>
          </Card>

          <div className="text-center">
            <Button
              type="submit"
              loading={loading}
              disabled={!formData.sld.trim()}
              icon={Plus}
              size="large"
            >
              Mint Domain
            </Button>
          </div>
        </form>

        {transactionStatus && (
          <div className={`mt-4 p-3 rounded-lg flex items-center space-x-2 ${
            transactionStatus.type === 'success' ? 'bg-green-50 text-green-800' :
            transactionStatus.type === 'error' ? 'bg-red-50 text-red-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            {getStatusIcon()}
            <span className="text-sm">{transactionStatus.message}</span>
          </div>
        )}
      </Card>

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
        </div>
      </Card>
    </div>
  );
};

export default DomainMintSection; 