import { broadcast } from "../utils/broadcast.js";
import { addSubscriber } from "../utils/storage.js";

// Add a test subscriber if none exists
addSubscriber("123456789"); // Replace with your actual chat ID

const testExpirationEvents = async () => {
  console.log("🧪 Testing Domain Expiration Events with Buy Links...\n");

  try {
    // Test 1: Domain Expired Event (with buy link)
    console.log("📝 Test 1: Domain Expired Event");
    const expiredEvent1 = {
      type: "DomainExpired",
      args: {
        tokenId: 5678,
        sld: "abc",
        tld: "doma"
      },
      txHash: null,
      blockNumber: null
    };

    await broadcast(expiredEvent1);
    console.log("✅ Domain expired event sent to Telegram\n");

    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 2: Another Domain Expired Event
    console.log("📝 Test 2: Another Domain Expired Event");
    const expiredEvent2 = {
      type: "DomainExpired",
      args: {
        tokenId: 9999,
        sld: "test",
        tld: "doma"
      },
      txHash: null,
      blockNumber: null
    };

    await broadcast(expiredEvent2);
    console.log("✅ Second domain expired event sent to Telegram\n");

    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 3: Domain with different TLD
    console.log("📝 Test 3: Domain with different TLD");
    const expiredEvent3 = {
      type: "DomainExpired",
      args: {
        tokenId: 1111,
        sld: "cool",
        tld: "test"
      },
      txHash: null,
      blockNumber: null
    };

    await broadcast(expiredEvent3);
    console.log("✅ Third domain expired event sent to Telegram\n");

    // Wait 2 seconds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Test 4: Domain with special characters
    console.log("📝 Test 4: Domain with special characters");
    const expiredEvent4 = {
      type: "DomainExpired",
      args: {
        tokenId: 2222,
        sld: "my-domain",
        tld: "doma"
      },
      txHash: null,
      blockNumber: null
    };

    await broadcast(expiredEvent4);
    console.log("✅ Fourth domain expired event sent to Telegram\n");

    console.log("🎉 All expiration events sent successfully!");
    console.log("📱 Check your Telegram bot for the messages with buy links!");
    console.log("\n🔗 Expected Buy Links:");
    console.log("- https://frontend.com/domain/abc");
    console.log("- https://frontend.com/domain/test");
    console.log("- https://frontend.com/domain/cool");
    console.log("- https://frontend.com/domain/my-domain");

  } catch (error) {
    console.error("❌ Error sending expiration events:", error);
  }
};

// Run the test
testExpirationEvents(); 