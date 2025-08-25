import fs from "fs";
import { Interface } from "ethers";
import { handleEventLog } from "../listeners/domaEvents.js";

const OwnershipTokenAbi = JSON.parse(
  fs.readFileSync(new URL("../abis/OwnershipToken.json", import.meta.url))
);

const iface = new Interface(OwnershipTokenAbi);

// Test OwnershipTokenMinted event
const testDomainMinted = () => {
  console.log("🧪 Testing OwnershipTokenMinted event...");
  
  const event = iface.getEvent("OwnershipTokenMinted");
  
  // Create event data in the correct format
  const eventData = {
    tokenId: 1234,
    registrarIanaId: 1,
    to: "0x1111111111111111111111111111111111111111",
    sld: "example",
    tld: "test",
    expiresAt: Math.floor(Date.now() / 1000) + 3600,
    correlationId: "abc123"
  };
  
  // Encode the event log
  const encoded = iface.encodeEventLog(event, eventData);
  
  // Fake log object
  const fakeLog = {
    topics: encoded.topics,
    data: encoded.data,
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    blockNumber: 12344,
    logIndex: 1
  };
  
  // Trigger the listener
  handleEventLog(fakeLog);
};

// Test NameTokenRenewed event
const testDomainRenewed = () => {
  console.log("🧪 Testing NameTokenRenewed event...");
  
  const event = iface.getEvent("NameTokenRenewed");
  
  // Create event data in the correct format
  const eventData = {
    tokenId: 5678,
    expiresAt: Math.floor(Date.now() / 1000) + 7200,
    correlationId: "renew123"
  };
  
  // Encode the event log
  const encoded = iface.encodeEventLog(event, eventData);
  
  // Fake log object
  const fakeLog = {
    topics: encoded.topics,
    data: encoded.data,
    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    blockNumber: 12345,
    logIndex: 0
  };
  
  // Trigger the listener
  handleEventLog(fakeLog);
};

// Test NameTokenBurned event
const testDomainBurned = () => {
  console.log("🧪 Testing NameTokenBurned event...");
  
  const event = iface.getEvent("NameTokenBurned");
  
  // Create event data in the correct format
  const eventData = {
    tokenId: 9999,
    owner: "0x2222222222222222222222222222222222222222",
    correlationId: "burn123"
  };
  
  // Encode the event log
  const encoded = iface.encodeEventLog(event, eventData);
  
  // Fake log object
  const fakeLog = {
    topics: encoded.topics,
    data: encoded.data,
    transactionHash: "0x3333333333333333333333333333333333333333333333333333333333333333",
    blockNumber: 12346,
    logIndex: 2
  };
  
  // Trigger the listener
  handleEventLog(fakeLog);
};

// Run tests
console.log("🚀 Starting domain event tests...\n");

testDomainMinted();
console.log("\n" + "=".repeat(50) + "\n");
testDomainRenewed();
console.log("\n" + "=".repeat(50) + "\n");
testDomainBurned();

console.log("\n✅ Tests completed!"); 