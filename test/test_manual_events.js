import { broadcast } from "../utils/broadcast.js";
import { addSubscriber } from "../utils/storage.js";

// Add a test subscriber if none exists
addSubscriber("123456789"); // Replace with your actual chat ID

const testManualEvents = async () => {
  console.log("🧪 Testing Manual Events for Telegram Bot...\n");

  try {
    // Test 1: Domain Minted Event
    console.log("📝 Test 1: Domain Minted Event");
    const mintedEvent = {
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

    await broadcast(mintedEvent);
    console.log("✅ Domain minted event sent to Telegram\n");

    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Domain Transfer Event
    console.log("📝 Test 2: Domain Transfer Event");
    const transferEvent = {
      type: "Transfer",
      args: {
        tokenId: 9999,
        from: "0x1111111111111111111111111111111111111111",
        to: "0x2222222222222222222222222222222222222222"
      },
      txHash: "0x3333333333333333333333333333333333333333333333333333333333333333",
      blockNumber: 12346
    };

    await broadcast(transferEvent);
    console.log("✅ Domain transfer event sent to Telegram\n");

    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: Domain Renewal Event
    console.log("📝 Test 3: Domain Renewal Event");
    const renewedEvent = {
      type: "NameTokenRenewed",
      args: {
        tokenId: 5678,
        expiresAt: Math.floor(Date.now() / 1000) + 7200
      },
      txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      blockNumber: 12345
    };

    await broadcast(renewedEvent);
    console.log("✅ Domain renewal event sent to Telegram\n");

    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 4: Domain Burned Event
    console.log("📝 Test 4: Domain Burned Event");
    const burnedEvent = {
      type: "NameTokenBurned",
      args: {
        tokenId: 9999,
        owner: "0x2222222222222222222222222222222222222222"
      },
      txHash: "0x4444444444444444444444444444444444444444444444444444444444444444",
      blockNumber: 12347
    };

    await broadcast(burnedEvent);
    console.log("✅ Domain burned event sent to Telegram\n");

    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 5: Lock Status Change Event
    console.log("📝 Test 5: Lock Status Change Event");
    const lockEvent = {
      type: "LockStatusChanged",
      args: {
        tokenId: 1234,
        isTransferLocked: true
      },
      txHash: "0x5555555555555555555555555555555555555555555555555555555555555555",
      blockNumber: 12348
    };

    await broadcast(lockEvent);
    console.log("✅ Lock status change event sent to Telegram\n");

    console.log("🎉 All manual events sent successfully!");
    console.log("📱 Check your Telegram bot for the messages!");

  } catch (error) {
    console.error("❌ Error sending manual events:", error);
  }
};

// Run the test
testManualEvents(); 