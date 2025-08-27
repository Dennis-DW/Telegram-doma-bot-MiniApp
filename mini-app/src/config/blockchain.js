import { ethers } from 'ethers';
import { DOMA_CONFIG } from './domaTestnet';
import { OWNERSHIP_TOKEN_ABI } from './miniAppABI';

// Initialize provider and contract
export const initializeBlockchain = async () => {
  try {
    // Check if MetaMask or other wallet is available
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      await provider.send("eth_requestAccounts", []);
      
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        DOMA_CONFIG.OWNERSHIP_TOKEN_ADDRESS,
        OWNERSHIP_TOKEN_ABI,
        signer
      );
      
      return { provider, signer, contract };
    } else {
      throw new Error('No wallet provider found. Please install MetaMask or another wallet.');
    }
  } catch (error) {
    console.error('Failed to initialize blockchain:', error);
    
    // Provide more specific error messages
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('Wallet connection was rejected by user');
    } else if (error.code === 'NETWORK_ERROR') {
      throw new Error('Network error. Please check your internet connection.');
    } else if (error.message.includes('User rejected')) {
      throw new Error('Wallet connection was rejected. Please try again.');
    } else {
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }
};

// Generate correlation ID for transactions
export const generateCorrelationId = () => {
  return `tg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format domain name
export const formatDomainName = (sld, tld) => {
  return `${sld}.${tld}`;
};

// Get transaction explorer URL
export const getTransactionUrl = (txHash) => {
  if (!txHash) return null;
  return `${DOMA_CONFIG.EXPLORER_URL}/tx/${txHash}`;
};

// Validate domain name format
export const validateDomainName = (domainName) => {
  if (!domainName || typeof domainName !== 'string') {
    return { valid: false, error: 'Domain name is required' };
  }
  
  const parts = domainName.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Domain must have exactly one dot (e.g., example.doma)' };
  }
  
  const [sld, tld] = parts;
  
  if (sld.length < 3) {
    return { valid: false, error: 'Second level domain must be at least 3 characters' };
  }
  
  if (sld.length > 63) {
    return { valid: false, error: 'Second level domain cannot exceed 63 characters' };
  }
  
  if (!/^[a-z0-9-]+$/.test(sld)) {
    return { valid: false, error: 'Domain can only contain lowercase letters, numbers, and hyphens' };
  }
  
  if (sld.startsWith('-') || sld.endsWith('-')) {
    return { valid: false, error: 'Domain cannot start or end with a hyphen' };
  }
  
  if (tld.length < 2) {
    return { valid: false, error: 'Top level domain must be at least 2 characters' };
  }
  
  return { valid: true, sld, tld };
};

// Check if domain is available (basic check)
export const checkDomainAvailability = async (contract, domainName) => {
  try {
    const validation = validateDomainName(domainName);
    if (!validation.valid) {
      return { available: false, error: validation.error };
    }
    
    // This is a simplified availability check
    // In production, you might want to implement a more sophisticated check
    // For now, we'll assume availability and let the contract handle conflicts
    
    return { available: true, message: 'Domain appears available' };
  } catch (error) {
    console.error('Error checking domain availability:', error);
    return { available: false, error: 'Error checking availability' };
  }
};

// Estimate gas for minting transaction
export const estimateMintingGas = async (contract, mintData) => {
  try {
    if (!contract || !mintData) {
      throw new Error('Invalid contract or mint data');
    }
    
    const gasEstimate = await contract.bulkMint.estimateGas(
      mintData.names,
      mintData.correlationId
    );
    
    return {
      gas: gasEstimate.toString(),
      gasPrice: await contract.provider.getFeeData().then(fee => fee.gasPrice?.toString() || '0')
    };
  } catch (error) {
    console.error('Error estimating gas:', error);
    throw new Error(`Gas estimation failed: ${error.message}`);
  }
};

// Prepare minting data structure
export const prepareMintData = (sld, tld, duration, owner, correlationId) => {
  const expiresAt = Math.floor(Date.now() / 1000) + (duration * 365 * 24 * 60 * 60);
  
  return {
    names: [{
      registrarIanaId: 1, // Default registrar ID
      sld: sld,
      tld: tld,
      tokenId: 0, // Contract will assign token ID
      expiresAt: expiresAt,
      owner: owner
    }],
    correlationId: correlationId
  };
};

// Wait for transaction confirmation with timeout
export const waitForTransaction = async (tx, timeoutMinutes = 10) => {
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const startTime = Date.now();
  
  try {
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      return { success: true, receipt };
    } else {
      return { success: false, error: 'Transaction failed on blockchain' };
    }
  } catch (error) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error('Transaction confirmation timeout');
    }
    throw error;
  }
};

// Handle transaction errors with user-friendly messages
export const handleTransactionError = (error) => {
  let errorMessage = 'Transaction failed';
  
  if (error.code === 'ACTION_REJECTED') {
    errorMessage = 'Transaction was rejected by user';
  } else if (error.code === 'INSUFFICIENT_FUNDS') {
    errorMessage = 'Insufficient funds for gas fees';
  } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
    errorMessage = 'Gas estimation failed. Please try again.';
  } else if (error.code === 'NETWORK_ERROR') {
    errorMessage = 'Network error. Please check your connection.';
  } else if (error.message.includes('execution reverted')) {
    errorMessage = 'Transaction reverted. Domain may not be available or contract error occurred.';
  } else if (error.message.includes('nonce')) {
    errorMessage = 'Transaction nonce error. Please try again.';
  } else if (error.message.includes('replacement transaction underpriced')) {
    errorMessage = 'Transaction replacement fee too low. Please try again.';
  } else {
    errorMessage = error.message || 'Unknown error occurred';
  }
  
  return errorMessage;
};

// Get network information
export const getNetworkInfo = async (provider) => {
  try {
    const network = await provider.getNetwork();
    const feeData = await provider.getFeeData();
    
    return {
      chainId: network.chainId.toString(),
      name: network.name,
      gasPrice: feeData.gasPrice?.toString() || '0',
      maxFeePerGas: feeData.maxFeePerGas?.toString() || '0',
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString() || '0'
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    throw new Error('Failed to get network information');
  }
}; 