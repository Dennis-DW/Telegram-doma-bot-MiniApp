// /listeners/domaEvents.js
import fs from "fs";
import { Interface } from "ethers"; 
import { web3 } from "../config/web3.js";
const OwnershipTokenAbi = JSON.parse(
  fs.readFileSync(new URL("../abis/OwnershipToken.json", import.meta.url))
);
import { saveEvent } from "../utils/storage.js";

const OWNERSHIP_TOKEN_ADDRESS = process.env.OWNERSHIP_TOKEN_ADDRESS;

// Create ethers.js contract interface
const iface = new Interface(OwnershipTokenAbi);

// Keep reference to listener for cleanup
let listener;
let expirationChecker;

// Store domain expiration times for monitoring
const domainExpirations = new Map();

export const startDomaListeners = async () => {
  console.log("🚀 Starting Doma event listeners on testnet...");

  listener = (log) => handleEventLog(log);

  web3.on(
    {
      address: OWNERSHIP_TOKEN_ADDRESS,
      topics: [] // listen to all events
    },
    listener
  );

  // Start domain expiration checker
  startExpirationChecker();

  console.log("✅ Listening to OwnershipToken contract events");
};

export const stopDomaListeners = async () => {
  if (listener) {
    console.log("🛑 Removing Doma listeners...");
    try {
      // ✅ safer disconnect depending on provider
      if (web3.currentProvider.disconnect) {
        web3.currentProvider.disconnect();
      } else if (web3.currentProvider.destroy) {
        web3.currentProvider.destroy();
      }
      listener = null;
      
      // Stop expiration checker
      if (expirationChecker) {
        clearInterval(expirationChecker);
        expirationChecker = null;
      }
      
      console.log("✅ Doma listeners removed successfully.");
    } catch (err) {
      console.error("❌ Failed to remove Doma listeners:", err);
    }
  }
};

// Domain expiration checker
const startExpirationChecker = () => {
  expirationChecker = setInterval(() => {
    const now = Math.floor(Date.now() / 1000);
    
    for (const [tokenId, domainInfo] of domainExpirations.entries()) {
      if (domainInfo.expiresAt <= now && !domainInfo.expired) {
        // Domain has expired
        domainInfo.expired = true;
        
        const expirationEvent = {
          type: "DomainExpired",
          args: {
            tokenId: tokenId,
            sld: domainInfo.sld,
            tld: domainInfo.tld
          },
          txHash: null,
          blockNumber: null,
          logIndex: null,
          timestamp: new Date().toISOString(),
          message: `⚠️ Domain Expired: ${domainInfo.sld}.${domainInfo.tld}\nToken ID: ${tokenId}`
        };
        
        console.log(expirationEvent.message);
        saveEvent(expirationEvent);
      }
    }
  }, 60000); // Check every minute
};

// === Helper: Handle Event Logs ===
function handleEventLog(log) {
  try {
    const parsed = iface.parseLog(log);

    const eventName = parsed.name;
    const args = parsed.args;

    console.log(`📢 Event: ${eventName}`, args);

    // Create event object with all necessary data
    const eventData = {
      type: eventName,
      args: args,
      txHash: log.transactionHash,
      blockNumber: log.blockNumber,
      logIndex: log.logIndex,
      timestamp: new Date().toISOString()
    };

    // Handle specific event types
    switch (eventName) {
      case "OwnershipTokenMinted":
        eventData.message = `✨ Domain Minted!\nToken ID: ${args.tokenId}\nOwner: ${args.to}\nSLD: ${args.sld}.${args.tld}\nExpires: ${new Date(Number(args.expiresAt) * 1000).toLocaleString()}`;
        
        // Track domain expiration
        domainExpirations.set(args.tokenId, {
          sld: args.sld,
          tld: args.tld,
          expiresAt: Number(args.expiresAt),
          expired: false
        });
        break;
        
      case "NameTokenRenewed":
        eventData.message = `♻️ Domain Renewed!\nToken ID: ${args.tokenId}\nNew Expiry: ${new Date(Number(args.expiresAt) * 1000).toLocaleString()}`;
        
        // Update domain expiration
        const existingDomain = domainExpirations.get(args.tokenId);
        if (existingDomain) {
          existingDomain.expiresAt = Number(args.expiresAt);
          existingDomain.expired = false;
        }
        break;
        
      case "NameTokenBurned":
        eventData.message = `🔥 Domain Burned!\nToken ID: ${args.tokenId}`;
        
        // Remove from expiration tracking
        domainExpirations.delete(args.tokenId);
        break;
        
      case "LockStatusChanged":
        eventData.message = `🔐 Lock Status Changed!\nToken ID: ${args.tokenId}\nStatus: ${args.isTransferLocked ? "🔒 Locked" : "🔓 Unlocked"}`;
        break;
        
      case "Transfer":
        eventData.message = `🔄 Domain Transferred!\nToken ID: ${args.tokenId}\nFrom: ${args.from}\nTo: ${args.to}`;
        break;

      default:
        eventData.message = `📢 Event: ${eventName}\n${JSON.stringify(args, null, 2)}`;
    }

    console.log(eventData.message);

    // ✅ Save event (this automatically broadcasts)
    saveEvent(eventData);

  } catch (err) {
    console.log("📜 Unrecognized event log:", log);
  }
}

export { handleEventLog };
