// config/web3.js - Event listening with HTTP provider
import Web3 from "web3";
import dotenv from "dotenv";

dotenv.config();

const domaRpcUrl = process.env.DOMA_RPC_URL;
console.log("Loaded DOMA_RPC_URL:", process.env.DOMA_RPC_URL);

if (!domaRpcUrl) {
  throw new Error("❌ Missing DOMA_RPC_URL in .env");
}

// Use HTTP provider for event listening (will use polling)
export const web3 = new Web3(new Web3.providers.HttpProvider(domaRpcUrl));

console.log("✅ Connected to Doma Testnet for event listening (HTTP polling)"); 