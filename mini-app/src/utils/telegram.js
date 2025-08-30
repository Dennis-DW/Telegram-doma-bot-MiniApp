// Telegram Web App utilities
export class TelegramWebApp {
  constructor() {
    this.tg = window.Telegram?.WebApp;
    this.init();
  }

  init() {
      if (process.env.NODE_ENV === 'development') {
    console.log('Initializing Telegram WebApp...');
    console.log('window.Telegram:', window.Telegram);
    console.log('window.Telegram?.WebApp:', window.Telegram?.WebApp);
  }
    
    if (!this.tg) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Telegram WebApp not available - this might be normal in development');
      }
      return;
    }

    try {
      // Initialize the Telegram WebApp
      this.tg.ready();
      if (process.env.NODE_ENV === 'development') {
        console.log('Telegram WebApp ready');
      }
      
      // Set up theme
      this.tg.expand();
      this.tg.enableClosingConfirmation();
      
      // Set main button if needed
      this.setupMainButton();
      if (process.env.NODE_ENV === 'development') {
        console.log('Telegram WebApp initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error);
    }
  }

  setupMainButton() {
    if (!this.tg) return;
    
    this.tg.MainButton.setText('CONNECT WALLET');
    this.tg.MainButton.onClick(() => {
      this.handleWalletConnection();
    });
  }

  handleWalletConnection() {
    // This will be handled by the wallet connection component
    window.dispatchEvent(new CustomEvent('connectWallet'));
  }

  showMainButton() {
    if (this.tg) {
      this.tg.MainButton.show();
    }
  }

  hideMainButton() {
    if (this.tg) {
      this.tg.MainButton.hide();
    }
  }

  showBackButton() {
    if (this.tg) {
      this.tg.BackButton.show();
    }
  }

  hideBackButton() {
    if (this.tg) {
      this.tg.BackButton.hide();
    }
  }

  onBackButtonClick(callback) {
    if (this.tg) {
      this.tg.BackButton.onClick(callback);
    }
  }

  showAlert(message) {
    if (this.tg) {
      this.tg.showAlert(message);
    } else {
      alert(message);
    }
  }

  showConfirm(message, callback) {
    if (this.tg) {
      this.tg.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      callback(result);
    }
  }

  showPopup(title, message, buttons = []) {
    if (this.tg) {
      this.tg.showPopup({ title, message, buttons });
    } else {
      alert(`${title}\n\n${message}`);
    }
  }

  getThemeParams() {
    if (this.tg) {
      return this.tg.themeParams;
    }
    return {};
  }

  getUser() {
    if (this.tg) {
      return this.tg.initDataUnsafe?.user;
    }
    return null;
  }

  getChatId() {
    if (this.tg) {
      return this.tg.initDataUnsafe?.chat?.id;
    }
    return null;
  }

  getStartParam() {
    if (this.tg) {
      return this.tg.initDataUnsafe?.start_param;
    }
    return null;
  }

  isExpanded() {
    if (this.tg) {
      return this.tg.isExpanded;
    }
    return false;
  }

  expand() {
    if (this.tg) {
      this.tg.expand();
    }
  }

  close() {
    if (this.tg) {
      this.tg.close();
    }
  }

  // Send data to bot
  sendData(data) {
    if (this.tg) {
      this.tg.sendData(JSON.stringify(data));
    }
  }

  // Show scan QR popup
  showScanQrPopup(text, callback) {
    if (this.tg) {
      this.tg.showScanQrPopup({ text }, callback);
    }
  }

  // Close scan QR popup
  closeScanQrPopup() {
    if (this.tg) {
      this.tg.closeScanQrPopup();
    }
  }

  // Show invoice
  showInvoice(url, callback) {
    if (this.tg) {
      this.tg.showInvoice(url, callback);
    }
  }

  // Request write access
  requestWriteAccess(callback) {
    if (this.tg) {
      this.tg.requestWriteAccess(callback);
    }
  }

  // Request contact
  requestContact(callback) {
    if (this.tg) {
      this.tg.requestContact(callback);
    }
  }

  // Invoke custom method
  invokeCustomMethod(method, params = {}) {
    if (this.tg) {
      return this.tg.invokeCustomMethod(method, params);
    }
    return Promise.reject(new Error('Telegram WebApp not available'));
  }
}

// Create global instance
export const telegramApp = new TelegramWebApp();

// Export for use in components
export default telegramApp; 