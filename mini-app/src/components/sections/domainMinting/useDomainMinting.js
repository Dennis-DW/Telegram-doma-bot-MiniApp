import { useState } from 'react';
import { ethers } from 'ethers';
import { 
  generateCorrelationId,
  validateDomainName,
  checkDomainAvailability,
  estimateMintingGas,
  prepareMintData,
  waitForTransaction,
  handleTransactionError
} from '../../../config/blockchain';
import telegramApp from '../../../utils/telegram';

export const useDomainMinting = (blockchain) => {
  const [formData, setFormData] = useState({
    sld: '',
    tld: 'doma',
    duration: '1'
  });
  const [loading, setLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [domainAvailability, setDomainAvailability] = useState(null);
  const [gasEstimate, setGasEstimate] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear availability check when domain name changes
    if (name === 'sld') {
      setDomainAvailability(null);
      setGasEstimate(null);
    }
  };

  const validateForm = () => {
    if (!formData.sld.trim()) {
      telegramApp.showAlert('Please enter a domain name');
      return false;
    }
    
    // Use the enhanced domain validation
    const validation = validateDomainName(`${formData.sld}.${formData.tld}`);
    if (!validation.valid) {
      telegramApp.showAlert(validation.error);
      return false;
    }
    
    return true;
  };

  // Handle availability change from the checker component
  const handleAvailabilityChange = (availability) => {
    setDomainAvailability(availability);
    
    if (availability.available) {
      // Estimate gas for minting
      estimateGas();
    }
  };

  // Estimate gas for minting transaction
  const estimateGas = async () => {
    if (!blockchain?.contract || !formData.sld.trim()) return;
    
    try {
      const duration = parseInt(formData.duration);
      const owner = await blockchain.signer.getAddress();
      const correlationId = generateCorrelationId();
      
      const mintData = prepareMintData(formData.sld, formData.tld, duration, owner, correlationId);
      const gasEst = await estimateMintingGas(blockchain.contract, mintData);
      
      setGasEstimate(gasEst);
      
    } catch (error) {
      console.error('Error estimating gas:', error);
      setGasEstimate(null);
    }
  };

  const handleMint = async () => {
    if (!validateForm()) return;
    if (!blockchain?.contract) {
      telegramApp.showAlert('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      setTransactionStatus({ type: 'pending', message: 'Preparing transaction...' });

      // Check domain availability first
      if (domainAvailability && !domainAvailability.available) {
        throw new Error(domainAvailability.error || 'Domain is not available');
      }

      const correlationId = generateCorrelationId();
      const duration = parseInt(formData.duration);
      const owner = await blockchain.signer.getAddress();
      
      // Prepare minting data using utility function
      const mintData = prepareMintData(formData.sld, formData.tld, duration, owner, correlationId);

      setTransactionStatus({ type: 'pending', message: 'Estimating gas...' });
      
      // Estimate gas and get fee data
      const gasEst = await estimateMintingGas(blockchain.contract, mintData);
      const feeData = await blockchain.provider.getFeeData();
      
      setTransactionStatus({ type: 'pending', message: 'Sending transaction...' });

      // Send transaction with gas estimation
      const tx = await blockchain.contract.bulkMint(
        mintData.names,
        mintData.correlationId,
        {
          gasLimit: ethers.BigNumber.from(gasEst.gas).mul(120).div(100), // Add 20% buffer
          maxFeePerGas: feeData.maxFeePerGas,
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
        }
      );

      setTransactionStatus({ 
        type: 'pending', 
        message: `Transaction sent! Hash: ${tx.hash}\nWaiting for confirmation...` 
      });

      // Wait for transaction confirmation using utility function
      const result = await waitForTransaction(tx, 10); // 10 minute timeout
      
      if (result.success) {
        // Transaction successful
        setTransactionStatus({
          type: 'success',
          message: `Domain ${formData.sld}.${formData.tld} minted successfully!`,
          txHash: tx.hash,
          receipt: result.receipt
        });

        // Send data to bot
        telegramApp.sendData({
          action: 'domain_minted',
          domain: `${formData.sld}.${formData.tld}`,
          correlationId: correlationId,
          txHash: tx.hash,
          tokenId: 'N/A', // Will be updated when event is processed
          address: owner
        });

        // Reset form
        setFormData({
          sld: '',
          tld: 'doma',
          duration: '1'
        });

        telegramApp.showAlert('Domain minted successfully! You will receive notifications about this domain.');
      } else {
        throw new Error(result.error || 'Transaction failed on blockchain');
      }

    } catch (error) {
      console.error('Failed to mint domain:', error);
      
      // Use the enhanced error handling utility
      const errorMessage = handleTransactionError(error);
      
      setTransactionStatus({
        type: 'error',
        message: errorMessage
      });
      
      telegramApp.showAlert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearTransactionStatus = () => {
    setTransactionStatus(null);
  };

  const resetForm = () => {
    setFormData({
      sld: '',
      tld: 'doma',
      duration: '1'
    });
    setDomainAvailability(null);
    setGasEstimate(null);
    setTransactionStatus(null);
  };

  return {
    formData,
    loading,
    transactionStatus,
    domainAvailability,
    gasEstimate,
    handleInputChange,
    handleAvailabilityChange,
    handleMint,
    clearTransactionStatus,
    resetForm
  };
}; 