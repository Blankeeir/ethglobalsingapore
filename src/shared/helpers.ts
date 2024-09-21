import { Asset } from "./types";
import { writeContract, getChainId, readContract } from "@wagmi/core";
import { config } from "../wagmi";
import { ABI_ASSETS, ABI_TOKENIZATION } from "./abi";
import {
  ASSETS_CONTRACT_ADDRESS,
  TOKENIZATION_CONTRACT_ADDRESS,
} from "./consts";
import { Address } from "viem";

const parseAsset = (asset: Asset) => {
  return {
    name: asset.name,
    length: BigInt(asset.length),
    year: asset.year,
    price: BigInt(asset.price),
  };
};

export const createAssetForSale = async (asset: Asset): Promise<string> => {
  console.log("Creating asset for sale:", asset);

  return "0x1234567890123456789012345678901234567890";

  // Call smart contract to create asset for sale
  // try {
  //   const hash = await writeContract(config, {
  //     abi: ABI_TOKENIZATION,
  //     address: TOKENIZATION_CONTRACT_ADDRESS,
  //     functionName: "tokenizeAsset",
  //     args: [parseAsset(asset)],
  //   });

  //   return hash;
  // } catch (e) {
  //   throw new Error("Error creating asset for sale");
  // }
};

export const loadAssets = async (): Promise<Asset[]> => {
  console.log("Loading assets");
  const assets = localStorage.getItem("assets") as string;

  return JSON.parse(assets);

  // Call smart contract to load assets
  // try {
  //   const assets = await readContract(config, {
  //     abi: ABI_ASSETS,
  //     address: TOKENIZATION_CONTRACT_ADDRESS,
  //     functionName: "getAssets",
  //     args: [],
  //   });

  //   return assets.map((asset: any) => ({
  //     name: asset.name,
  //     length: Number(asset.length),
  //     year: asset.year,
  //     price: Number(asset.price),
  //   }));
  // } catch (e) {
  //   throw new Error("Error loading assets");
  // }
};

export const requestAssetAttestation = async (
  assetId: Address
): Promise<string> => {
  console.log("Requesting asset attestation:", assetId);

  return "0x1234567890123456789012345678901234567890";

  // Call smart contract to request asset attestation
  try {
    const hash = await writeContract(config, {
      abi: ABI_ASSETS,
      address: ASSETS_CONTRACT_ADDRESS,
      functionName: "requestAttestation",
      args: [assetId],
    });

    return hash;
  } catch (e) {
    throw new Error("Error requesting asset attestation");
  }
};

export const attestAsset = async (assetId: Address): Promise<string> => {
  console.log("Attesting asset:", assetId);

  return "0x1234567890123456789012345678901234567890";

  // Call smart contract to attest asset
  try {
    const hash = await writeContract(config, {
      abi: ABI_ASSETS,
      address: ASSETS_CONTRACT_ADDRESS,
      functionName: "attestAsset",
      args: [assetId],
    });

    return hash;
  } catch (e) {
    throw new Error("Error attesting asset");
  }
};
