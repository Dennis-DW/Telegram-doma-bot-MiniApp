// config/web3.js
import Web3 from "web3";
import dotenv from "dotenv";

dotenv.config();

const domaRpcUrl = process.env.DOMA_RPC_URL;
console.log("Loaded DOMA_RPC_URL:", process.env.DOMA_RPC_URL);

if (!domaRpcUrl) {
  throw new Error("❌ Missing DOMA_RPC_URL in .env");
}

// Use WebSocket provider (better for listening to events)
export const web3 = new Web3(new Web3.providers.WebsocketProvider(domaRpcUrl));

console.log("✅ Connected to Doma Testnet");
