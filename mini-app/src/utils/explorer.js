import CONFIG from '../config';

/**
 * Get explorer URL for a transaction with fallback options
 * @param {string} txHash - Transaction hash
 * @param {string} type - Type of URL (tx, address, etc.)
 * @returns {string} Explorer URL
 */
export const getExplorerUrl = (txHash, type = 'tx') => {
  const explorers = CONFIG.URLS.EXPLORERS;
  
  // Try primary explorer first
  try {
    return `${explorers.PRIMARY}/${type}/${txHash}`;
  } catch (error) {
          if (process.env.NODE_ENV === 'development') {
        console.warn('Primary explorer failed, using fallback');
      }
    return `${explorers.FALLBACK}/${type}/${txHash}`;
  }
};

/**
 * Open explorer URL with error handling and fallbacks
 * @param {string} txHash - Transaction hash
 * @param {string} type - Type of URL (tx, address, etc.)
 */
export const openExplorer = async (txHash, type = 'tx') => {
  const explorers = CONFIG.URLS.EXPLORERS;
  const explorersList = [
    `${explorers.PRIMARY}/${type}/${txHash}`,
    `${explorers.FALLBACK}/${type}/${txHash}`,
    `${explorers.ALTERNATIVE}/${type}/${txHash}`
  ];

  for (const url of explorersList) {
    try {
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Successfully opened explorer: ${url}`);
        }
        return true;
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to open explorer ${url}:`, error);
      }
      continue;
    }
  }

  // If all explorers fail, copy to clipboard
  try {
    await navigator.clipboard.writeText(explorersList[0]);
    alert('Explorer link copied to clipboard!');
    return false;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    alert('Failed to open explorer. Please try manually visiting the explorer.');
    return false;
  }
};

/**
 * Check if explorer is accessible
 * @param {string} baseUrl - Base URL to test
 * @returns {Promise<boolean>} Whether the explorer is accessible
 */
export const checkExplorerAccess = async (baseUrl) => {
  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: 'HEAD',
      mode: 'no-cors',
      timeout: 5000
    });
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Explorer ${baseUrl} is not accessible:`, error);
    }
    return false;
  }
};

export default {
  getExplorerUrl,
  openExplorer,
  checkExplorerAccess
}; 