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
    throw error;
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
  return `${DOMA_CONFIG.EXPLORER_URL}/tx/${txHash}`;
}; 