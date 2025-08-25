import { handleEventLog } from "../listeners/domaEvents.js";

// Test the event handling logic directly
const testEventHandling = () => {
  console.log("🧪 Testing event handling logic...\n");

  // Test 1: OwnershipTokenMinted event
  console.log("📝 Test 1: OwnershipTokenMinted event");
  const mintedLog = {
    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    blockNumber: 12344,
    logIndex: 1
  };
  
  // Mock the parsed event data
  const mockParsed = {
    name: "OwnershipTokenMinted",
    args: {
      tokenId: 1234,
      registrarIanaId: 1,
      to: "0x1111111111111111111111111111111111111111",
      sld: "example",
      tld: "test",
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
      correlationId: "abc123"
    }
  };

  // Mock the iface.parseLog function
  const originalParseLog = require("ethers").Interface.prototype.parseLog;
  require("ethers").Interface.prototype.parseLog = () => mockParsed;

  try {
    handleEventLog(mintedLog);
    console.log("✅ OwnershipTokenMinted test passed\n");
  } catch (error) {
    console.error("❌ OwnershipTokenMinted test failed:", error.message);
  }

  // Test 2: NameTokenRenewed event
  console.log("📝 Test 2: NameTokenRenewed event");
  const renewedLog = {
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    blockNumber: 12345,
    logIndex: 2
  };

  const mockParsedRenewed = {
    name: "NameTokenRenewed",
    args: {
      tokenId: 5678,
      expiresAt: Math.floor(Date.now() / 1000) + 7200,
      correlationId: "renew123"
    }
  };

  require("ethers").Interface.prototype.parseLog = () => mockParsedRenewed;

  try {
    handleEventLog(renewedLog);
    console.log("✅ NameTokenRenewed test passed\n");
  } catch (error) {
    console.error("❌ NameTokenRenewed test failed:", error.message);
  }

  // Test 3: NameTokenBurned event
  console.log("📝 Test 3: NameTokenBurned event");
  const burnedLog = {
    transactionHash: "0x3333333333333333333333333333333333333333333333333333333333333333",
    blockNumber: 12346,
    logIndex: 3
  };

  const mockParsedBurned = {
    name: "NameTokenBurned",
    args: {
      tokenId: 9999,
      owner: "0x2222222222222222222222222222222222222222",
      correlationId: "burn123"
    }
  };

  require("ethers").Interface.prototype.parseLog = () => mockParsedBurned;

  try {
    handleEventLog(burnedLog);
    console.log("✅ NameTokenBurned test passed\n");
  } catch (error) {
    console.error("❌ NameTokenBurned test failed:", error.message);
  }

  // Test 4: Transfer event
  console.log("📝 Test 4: Transfer event");
  const transferLog = {
    transactionHash: "0x4444444444444444444444444444444444444444444444444444444444444444",
    blockNumber: 12347,
    logIndex: 4
  };

  const mockParsedTransfer = {
    name: "Transfer",
    args: {
      from: "0x1111111111111111111111111111111111111111",
      to: "0x2222222222222222222222222222222222222222",
      tokenId: 1234
    }
  };

  require("ethers").Interface.prototype.parseLog = () => mockParsedTransfer;

  try {
    handleEventLog(transferLog);
    console.log("✅ Transfer test passed\n");
  } catch (error) {
    console.error("❌ Transfer test failed:", error.message);
  }

  // Restore original function
  require("ethers").Interface.prototype.parseLog = originalParseLog;
};

// Test broadcast functionality
const testBroadcast = async () => {
  console.log("🧪 Testing broadcast functionality...\n");
  
  const { broadcast } = await import("../utils/broadcast.js");
  
  // Test broadcast with event object
  const testEvent = {
    type: "OwnershipTokenMinted",
    args: {
      tokenId: 1234,
      to: "0x1111111111111111111111111111111111111111",
      sld: "example",
      tld: "test",
      expiresAt: Math.floor(Date.now() / 1000) + 3600
    },
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    blockNumber: 12344
  };

  try {
    await broadcast(testEvent);
    console.log("✅ Broadcast test passed\n");
  } catch (error) {
    console.error("❌ Broadcast test failed:", error.message);
  }
};

// Run tests
console.log("🚀 Starting simple event tests...\n");

testEventHandling();
await testBroadcast();

console.log("✅ All tests completed!"); 