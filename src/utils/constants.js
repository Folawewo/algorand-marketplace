import algosdk from "algosdk";
import MyAlgoConnect from "@randlabs/myalgo-connect";

const config = {
  algodToken: "",
  algodServer: "https://testnet-api.algonode.network",
  algodPort: "",
  indexerToken: "",
  indexerServer: "https://testnet-idx.algonode.network",
  indexerPort: "",
};

export const algodClient = new algosdk.Algodv2(
  config.algodToken,
  config.algodServer,
  config.algodPort
);

export const indexerClient = new algosdk.Indexer(
  config.indexerToken,
  config.indexerServer,
  config.indexerPort
);

export const myAlgoConnect = new MyAlgoConnect({
  timeout: 100000000,
});

export const minRound = 29556983;

export const marketplaceNote = "tutorial-marketplace:uv1"

// Maximum local storage allocation, immutable
export const numLocalInts = 0;
export const numLocalBytes = 0;
// Maximum global storage allocation, immutable
export const numGlobalInts = 2; 
export const numGlobalBytes = 3; 
export const ALGORAND_DECIMALS = 6;

