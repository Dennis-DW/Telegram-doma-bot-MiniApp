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

// Keep reference to polling interval for cleanup
let pollingInterval;
let expirationChecker;

// Store domain expiration times for monitoring
const domainExpirations = new Map();

// Store last processed block to avoid duplicate events
let lastProcessedBlock = 0;

// Custom JSON serializer to handle BigInt
const customStringify = (obj) => {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  }, 2);
};

// Helper function to convert BigInt values to strings in event args
const convertBigIntsToStrings = (obj) => {
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntsToStrings);
  }
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = convertBigIntsToStrings(value);
    }
    return result;
  }
  return obj;
};

export const startDomaListeners = async () => {
  console.log("🚀 Starting Doma event listeners on testnet...");
  console.log(`📍 Contract Address: ${OWNERSHIP_TOKEN_ADDRESS}`);
  console.log(`🔗 RPC URL: ${process.env.DOMA_RPC_URL}`);
  console.log("=".repeat(60));

  // Check connection status
  try {
    const isConnected = await web3.eth.net.isListening();
    console.log(`🔌 Connection Status: ${isConnected ? '✅ Connected' : '❌ Not Connected'}`);
    
    if (!isConnected) {
      console.error("❌ Failed to connect to blockchain. Please check your RPC URL.");
      return;
    }

    // Get current block number to verify connection
    const blockNumber = await web3.eth.getBlockNumber();
    console.log(`📦 Current Block Number: ${blockNumber}`);
    
    // Initialize last processed block (convert BigInt to Number)
    lastProcessedBlock = Number(blockNumber) - 1;
    console.log(`📋 Starting from block: ${lastProcessedBlock + 1}`);
    
  } catch (error) {
    console.error("❌ Connection test failed:", error.message);
    return;
  }

  // Start polling for events
  startEventPolling();

  // Start domain expiration checker
  startExpirationChecker();

  console.log("✅ Listening to OwnershipToken contract events (HTTP polling)");
  console.log("📡 Polling for blockchain events every 10 seconds...");
  console.log("=".repeat(60));
};

export const stopDomaListeners = async () => {
  if (pollingInterval) {
    console.log("🛑 Removing Doma listeners...");
    try {
      clearInterval(pollingInterval);
      pollingInterval = null;
      
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

// Event polling function
const startEventPolling = () => {
  pollingInterval = setInterval(async () => {
    try {
      const currentBlock = await web3.eth.getBlockNumber();
      const currentBlockNumber = Number(currentBlock);
      
      if (currentBlockNumber > lastProcessedBlock) {
        console.log(`🔍 Polling blocks ${lastProcessedBlock + 1} to ${currentBlockNumber}...`);
        
        // Get events from the contract
        const events = await web3.eth.getPastLogs({
          address: OWNERSHIP_TOKEN_ADDRESS,
          fromBlock: lastProcessedBlock + 1,
          toBlock: currentBlockNumber,
          topics: [] // Get all events
        });
        
        if (events.length > 0) {
          console.log(`📢 Found ${events.length} event(s) in blocks ${lastProcessedBlock + 1} to ${currentBlockNumber}`);
          
          for (const event of events) {
            handleEventLog(event);
          }
        } else {
          console.log(`📭 No events found in blocks ${lastProcessedBlock + 1} to ${currentBlockNumber}`);
        }
        
        lastProcessedBlock = currentBlockNumber;
      }
    } catch (error) {
      console.error("❌ Error polling for events:", error.message);
    }
  }, 10000); // Poll every 10 seconds
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
            tokenId: tokenId.toString(),
            sld: domainInfo.sld,
            tld: domainInfo.tld
          },
          txHash: null,
          blockNumber: null,
          logIndex: null,
          timestamp: new Date().toISOString(),
          message: `⚠️ Domain Expired: ${domainInfo.sld}.${domainInfo.tld}\nToken ID: ${tokenId}`
        };
        
        console.log("=".repeat(60));
        console.log("⚠️  DOMAIN EXPIRED EVENT");
        console.log("=".repeat(60));
        console.log(expirationEvent.message);
        console.log("=".repeat(60));
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

    // Convert BigInt values to strings for safe serialization
    const safeArgs = convertBigIntsToStrings(args);

    // Enhanced console logging with better formatting
    console.log("=".repeat(60));
    console.log(`📢 BLOCKCHAIN EVENT DETECTED: ${eventName.toUpperCase()}`);
    console.log("=".repeat(60));
    console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
    console.log(`🔗 Transaction Hash: ${log.transactionHash}`);
    console.log(`📦 Block Number: ${log.blockNumber}`);
    console.log(`📋 Log Index: ${log.logIndex}`);
    console.log(`📍 Contract Address: ${log.address}`);
    console.log(`📝 Event Name: ${eventName}`);
    console.log("📊 Event Arguments:");
    console.log(customStringify(safeArgs));
    console.log("=".repeat(60));

    // Create event object with all necessary data
    const eventData = {
      type: eventName,
      args: safeArgs,
      txHash: log.transactionHash,
      blockNumber: log.blockNumber,
      logIndex: log.logIndex,
      timestamp: new Date().toISOString()
    };

    // Handle specific event types with detailed logging
    switch (eventName) {
      case "OwnershipTokenMinted":
        // args is an array: [tokenId, registrarIanaId, to, sld, tld, expiresAt, correlationId]
        const tokenId = safeArgs[0];
        const registrarIanaId = safeArgs[1];
        const to = safeArgs[2];
        const sld = safeArgs[3];
        const tld = safeArgs[4];
        const expiresAt = safeArgs[5];
        const correlationId = safeArgs[6];
        
        eventData.message = `✨ Domain Minted!\nToken ID: ${tokenId}\nOwner: ${to}\nSLD: ${sld}.${tld}\nExpires: ${new Date(Number(expiresAt) * 1000).toLocaleString()}`;
        
        console.log("🎉 NEW DOMAIN MINTED!");
        console.log(`   Token ID: ${tokenId}`);
        console.log(`   Owner: ${to}`);
        console.log(`   Domain: ${sld}.${tld}`);
        console.log(`   Expires: ${new Date(Number(expiresAt) * 1000).toLocaleString()}`);
        
        // Track domain expiration
        domainExpirations.set(tokenId, {
          sld: sld,
          tld: tld,
          expiresAt: Number(expiresAt),
          expired: false
        });
        break;
        
      case "NameTokenRenewed":
        // args is an array: [tokenId, expiresAt]
        const renewedTokenId = safeArgs[0];
        const newExpiresAt = safeArgs[1];
        
        eventData.message = `♻️ Domain Renewed!\nToken ID: ${renewedTokenId}\nNew Expiry: ${new Date(Number(newExpiresAt) * 1000).toLocaleString()}`;
        
        console.log("🔄 DOMAIN RENEWED!");
        console.log(`   Token ID: ${renewedTokenId}`);
        console.log(`   New Expiry: ${new Date(Number(newExpiresAt) * 1000).toLocaleString()}`);
        
        // Update domain expiration
        const existingDomain = domainExpirations.get(renewedTokenId);
        if (existingDomain) {
          existingDomain.expiresAt = Number(newExpiresAt);
          existingDomain.expired = false;
        }
        break;
        
      case "NameTokenBurned":
        // args is an array: [tokenId]
        const burnedTokenId = safeArgs[0];
        
        eventData.message = `🔥 Domain Burned!\nToken ID: ${burnedTokenId}`;
        
        console.log("🔥 DOMAIN BURNED!");
        console.log(`   Token ID: ${burnedTokenId}`);
        
        // Remove from expiration tracking
        domainExpirations.delete(burnedTokenId);
        break;
        
      case "LockStatusChanged":
        // args is an array: [tokenId, isTransferLocked]
        const lockTokenId = safeArgs[0];
        const isTransferLocked = safeArgs[1];
        
        eventData.message = `🔐 Lock Status Changed!\nToken ID: ${lockTokenId}\nStatus: ${isTransferLocked ? "🔒 Locked" : "🔓 Unlocked"}`;
        
        console.log("🔐 LOCK STATUS CHANGED!");
        console.log(`   Token ID: ${lockTokenId}`);
        console.log(`   Status: ${isTransferLocked ? "🔒 Locked" : "🔓 Unlocked"}`);
        break;
        
      case "Transfer":
        // args is an array: [from, to, tokenId]
        const from = safeArgs[0];
        const transferTo = safeArgs[1];
        const transferTokenId = safeArgs[2];
        
        eventData.message = `🔄 Domain Transferred!\nToken ID: ${transferTokenId}\nFrom: ${from}\nTo: ${transferTo}`;
        
        console.log("🔄 DOMAIN TRANSFERRED!");
        console.log(`   Token ID: ${transferTokenId}`);
        console.log(`   From: ${from}`);
        console.log(`   To: ${transferTo}`);
        break;

      case "NameTokenLocked":
        // args is an array: [tokenId, by]
        const lockedTokenId = safeArgs[0];
        const lockedBy = safeArgs[1];
        
        eventData.message = `🔒 Domain Locked!\nToken ID: ${lockedTokenId}\nLocked By: ${lockedBy}`;
        
        console.log("🔒 DOMAIN LOCKED!");
        console.log(`   Token ID: ${lockedTokenId}`);
        console.log(`   Locked By: ${lockedBy}`);
        break;

      case "NameTokenUnlocked":
        // args is an array: [tokenId, by]
        const unlockedTokenId = safeArgs[0];
        const unlockedBy = safeArgs[1];
        
        eventData.message = `🔓 Domain Unlocked!\nToken ID: ${unlockedTokenId}\nUnlocked By: ${unlockedBy}`;
        
        console.log("🔓 DOMAIN UNLOCKED!");
        console.log(`   Token ID: ${unlockedTokenId}`);
        console.log(`   Unlocked By: ${unlockedBy}`);
        break;

      case "RegistrarChanged":
        // args is an array: [tokenId, newRegistrar]
        const registrarTokenId = safeArgs[0];
        const newRegistrar = safeArgs[1];
        
        eventData.message = `🏢 Registrar Changed!\nToken ID: ${registrarTokenId}\nNew Registrar: ${newRegistrar}`;
        
        console.log("🏢 REGISTRAR CHANGED!");
        console.log(`   Token ID: ${registrarTokenId}`);
        console.log(`   New Registrar: ${newRegistrar}`);
        break;

      case "MetadataUpdated":
        // args is an array: [tokenId]
        const metadataTokenId = safeArgs[0];
        
        eventData.message = `📝 Metadata Updated!\nToken ID: ${metadataTokenId}`;
        
        console.log("📝 METADATA UPDATED!");
        console.log(`   Token ID: ${metadataTokenId}`);
        break;

      default:
        eventData.message = `📢 Event: ${eventName}\n${customStringify(safeArgs)}`;
        console.log(`📢 UNKNOWN EVENT TYPE: ${eventName}`);
        console.log(`   Raw Data: ${customStringify(safeArgs)}`);
    }

    console.log("📤 Broadcasting to subscribers...");
    console.log("=".repeat(60));

    // ✅ Save event (this automatically broadcasts)
    saveEvent(eventData);

  } catch (err) {
    console.log("=".repeat(60));
    console.log("❌ UNRECOGNIZED EVENT LOG");
    console.log("=".repeat(60));
    console.log("Raw Log Data:");
    try {
      console.log(customStringify(log));
    } catch (error) {
      console.log("❌ UNRECOGNIZED EVENT LOG - [BigInt data - serialization skipped]");
    }
    console.log("Error:", err.message);
    console.log("=".repeat(60));
  }
}

export { handleEventLog };