// commands/admin.js
// This file now serves as a simple entry point to the modular admin system
// The actual implementation is in the commands/admin/ folder

import './admin/index.js';

console.log("📝 Note: Admin commands are now modularized in the commands/admin/ folder");
console.log("🔧 The main admin logic has been moved to commands/admin/index.js");
console.log("🚀 Loading admin commands from commands/admin/index.js...");

// Export the isAdmin function for backward compatibility
export { isAdmin } from './admin/index.js';
