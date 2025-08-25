import fs from "fs";
import { Interface } from "ethers";
import { handleEventLog } from "../listeners/domaEvents.js";

const OwnershipTokenAbi = JSON.parse(
  fs.readFileSync(new URL("../abis/OwnershipToken.json", import.meta.url))
);

const iface = new Interface(OwnershipTokenAbi);

// Split args correctly: ethers v6 expects separate arrays for indexed and non-indexed
const event = iface.getEvent("OwnershipTokenMinted");

// Indexed args = tokenId
const indexedArgs = [1234];

// Non-indexed args = to, sld, tld, expiresAt, correlationId
const nonIndexedArgs = [
  "0x1111111111111111111111111111111111111111",
  "example",
  "test",
  Math.floor(Date.now() / 1000) + 3600,
  "abc123"
];

// Encode the event log
const encoded = iface.encodeEventLog(event, { indexed: indexedArgs, data: nonIndexedArgs });

// Fake log object
const fakeLog = {
  topics: encoded.topics,
  data: encoded.data
};

// Trigger your listener
handleEventLog(fakeLog);
