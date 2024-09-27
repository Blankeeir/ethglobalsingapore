// src/shared/helpers.ts

import { writeContract, readContract } from '@wagmi/core';
import { Interface, parseUnits, formatUnits, formatEther } from 'ethers'; // Updated imports for Ethers.js v6
import { 
  MARKETPLACE_CONTRACT_ADDRESS, 
  ATTESTATION_CONTRACT_ADDRESS, 
  RWA_PROCESS_CONTRACT_ADDRESS,
  USDC_CONTRACT_ADDRESS
} from './consts';
import ABI_MARKETPLACE from './abis/ABI_MARKETPLACE.json';
import ABI_ATTESTATION from './abis/ABI_ATTESTATION.json';
import ABI_RWA_PROCESS from './abis/ABI_RWA_PROCESS.json';
import ABI_USDC from './abis/ABI_USDC.json'; // Ensure you have the USDC ABI
import { Asset, Purchase, Sale, Verification, Attestation } from './types';
import { Address } from 'viem';
import { getClient } from '@wagmi/core'; // For accessing the provider

// Function to create an asset for sale
export const createAssetForSale = async (
  asset: Asset, 
  seller: Address, 
  tokenURI: string
): Promise<string> => {
  console.log('Creating asset for sale:', asset);
  
  try {
    // 1. Mint the NFT and tokenize the asset through the RWAProcess contract
    const mintAndSwapTx = await writeContract(
      {
        address: RWA_PROCESS_CONTRACT_ADDRESS,
        abi: ABI_RWA_PROCESS,
        functionName: 'mintAndSwap',
        args: [
          seller, 
          tokenURI, 
          parseUnits(asset.price.toString(), 6) // USDC has 6 decimals
        ],
        chainId: 100, // Gnosis Chain ID
      },
      {} // Empty parameters object
    );

    console.log('Asset tokenization transaction hash:', mintAndSwapTx.hash);
    await mintAndSwapTx.wait(); // Wait for transaction confirmation

    // Fetch tokenId from transaction receipt (Assuming an event is emitted)
    const provider = getClient().provider;
    if (!provider) {
      throw new Error('Provider not available');
    }

    const receipt = await provider.getTransactionReceipt(mintAndSwapTx.hash);
    const iface = new Interface(ABI_RWA_PROCESS);
    let tokenId: string = '';

    for (const log of receipt.logs) {
      try {
        const parsedLog = iface.parseLog(log);
        if (parsedLog.name === 'TokenMinted') { // Replace with actual event name
          tokenId = parsedLog.args.tokenId.toString();
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!tokenId) {
      throw new Error('Token ID not found in transaction receipt');
    }

    // 2. List the asset in the Marketplace contract
    const listTx = await writeContract({
        address: MARKETPLACE_CONTRACT_ADDRESS,
        abi: ABI_MARKETPLACE,
        functionName: 'listAsset',
        args: [
          tokenId, 
          parseUnits(asset.price.toString(), 6), // Price in USDC
          asset.name,
          asset.image,
          asset.year,
          asset.length,
        ],
        chainId: 100, // Gnosis Chain ID
      },
      {}
  );

    console.log('Asset listing transaction hash:', listTx.hash);
    await listTx.wait(); // Wait for transaction confirmation

    console.log('Asset successfully listed for sale.');
    return listTx.hash;

  } catch (error) {
    console.error('Error creating asset for sale:', error);
    throw new Error('Error creating asset for sale');
  }
};

// Function to load all assets from Marketplace
export const loadAssets = async (): Promise<Asset[]> => {
  console.log('Loading assets from Marketplace');
  
  try {
    const assets = await readContract({
      address: MARKETPLACE_CONTRACT_ADDRESS,
      abi: ABI_MARKETPLACE,
      functionName: 'getAllAssets', // Ensure this function exists in your contract
      args: [],
      chainId: 100, // Gnosis Chain ID
    },
  {}
);

    const formattedAssets: Asset[] = assets.map((asset: any) => ({
      name: asset.name,
      length: Number(asset.length),
      year: asset.year,
      price: Number(formatUnits(asset.price, 6)), // USDC has 6 decimals
      image: asset.image,
      address: asset.tokenId.toString(),
      status: asset.status,
      attestations: [], // Fetch attestations separately if needed
    }));

    return formattedAssets;

  } catch (error) {
    console.error('Error loading assets:', error);
    throw new Error('Error loading assets');
  }
};

// Function to load asset details
export const loadAssetDetails = async (assetId: string): Promise<Asset> => {
  console.log('Loading asset details for:', assetId);

  try {
    const asset = await readContract({
      address: MARKETPLACE_CONTRACT_ADDRESS,
      abi: ABI_MARKETPLACE,
      functionName: 'getAssetDetails',
      args: [assetId],
      chainId: 100, // Gnosis Chain ID
    },
    {}
  );

    // Fetch attestation history from Attestation Contract
    const attestations = await readContract({
      address: ATTESTATION_CONTRACT_ADDRESS,
      abi: ABI_ATTESTATION,
      functionName: 'getAttestationsForAsset',
      args: [assetId],
      chainId: 100,
    });

    const formattedAttestations: Attestation[] = attestations.map((att: any) => ({
      verifier: att.verifier,
      timestamp: Number(att.timestamp),
      success: att.success,
    }));

    const formattedAsset: Asset = {
      name: asset.name,
      length: Number(asset.length),
      year: asset.year,
      price: Number(formatUnits(asset.price, 6)),
      image: asset.image,
      address: asset.tokenId.toString(),
      status: asset.status,
      attestations: formattedAttestations,
    };

    return formattedAsset;

  } catch (error) {
    console.error('Error loading asset details:', error);
    throw new Error('Error loading asset details');
  }
};

// Function to purchase an asset
export const purchaseAsset = async (assetId: string, buyer: Address): Promise<string> => {
  console.log('Purchasing asset:', assetId, 'by buyer:', buyer);

  try {
    // Fetch asset details to get price
    const asset = await loadAssetDetails(assetId);
    const priceInUSDC = parseUnits(asset.price.toString(), 6); // USDC has 6 decimals

    // Approve the Marketplace contract to spend buyer's USDC
    const approveTx = await writeContract({
      address: USDC_CONTRACT_ADDRESS,
      abi: ABI_USDC,
      functionName: 'approve',
      args: [MARKETPLACE_CONTRACT_ADDRESS, priceInUSDC],
      chainId: 100,
    },
    {}
  );

    console.log('USDC approval transaction hash:', approveTx.hash);
    await approveTx.wait();

    // Call the purchaseAsset function on Marketplace contract
    const purchaseTx = await writeContract({
      address: MARKETPLACE_CONTRACT_ADDRESS,
      abi: ABI_MARKETPLACE,
      functionName: 'purchaseAsset',
      args: [assetId],
      chainId: 100,
    });

    console.log('Asset purchase transaction hash:', purchaseTx.hash);
    await purchaseTx.wait();

    console.log('Asset purchased successfully.');
    return purchaseTx.hash;

  } catch (error) {
    console.error('Error purchasing asset:', error);
    throw new Error('Error purchasing asset');
  }
};

// Function to attest and buy an asset
export const attestAndBuyAsset = async (assetId: string, buyer: Address): Promise<string> => {
  console.log('Attesting and buying asset:', assetId, 'by buyer:', buyer);

  try {
    // 1. Request Attestation
    const attestationTx = await requestAssetAttestation(assetId);
    console.log('Attestation request transaction hash:', attestationTx.hash);
    await attestationTx.wait();

    // 2. Purchase Asset after successful attestation
    const purchaseHash = await purchaseAsset(assetId, buyer);
    console.log('Asset purchased after attestation:', purchaseHash);

    return purchaseHash;

  } catch (error) {
    console.error('Error attesting and buying asset:', error);
    throw new Error('Error attesting and buying asset');
  }
};

// Function to submit an attestation
export const submitAttestation = async (assetId: string, verifier: Address, approved: boolean): Promise<string> => {
  console.log('Submitting attestation for asset:', assetId, 'by verifier:', verifier, 'Approved:', approved);

  try {
    const attestationTx = await writeContract({
      address: ATTESTATION_CONTRACT_ADDRESS,
      abi: ABI_ATTESTATION,
      functionName: 'submitAttestation',
      args: [assetId, verifier, approved],
      chainId: 100,
    });

    console.log('Attestation submission transaction hash:', attestationTx.hash);
    await attestationTx.wait();

    console.log('Attestation submitted successfully.');
    return attestationTx.hash;

  } catch (error) {
    console.error('Error submitting attestation:', error);
    throw new Error('Error submitting attestation');
  }
};

// Function to fetch historical purchases
export const getUserHistoricalPurchases = async (userAddress: Address): Promise<Purchase[]> => {
  console.log('Fetching historical purchases for:', userAddress);

  try {
    const purchases = await readContract({
      address: MARKETPLACE_CONTRACT_ADDRESS,
      abi: ABI_MARKETPLACE,
      functionName: 'getPurchasesByBuyer',
      args: [userAddress],
      chainId: 100,
    },
    
  );

    const formattedPurchases: Purchase[] = purchases.map((purchase: any) => ({
      sellerAddress: purchase.seller,
      tokenTransferred: formatUnits(purchase.amount, 6), // USDC has 6 decimals
      gasFee: formatEther(purchase.gasFee),
      timestamp: Number(purchase.timestamp),
      assetName: purchase.assetName,
      attestationStatus: purchase.attestationStatus,
      verifyingNode: purchase.verifyingNode,
    }));

    return formattedPurchases;

  } catch (error) {
    console.error('Error fetching historical purchases:', error);
    throw new Error('Error fetching historical purchases');
  }
};

// Function to fetch historical sales
export const getUserHistoricalSales = async (userAddress: Address): Promise<Sale[]> => {
  console.log('Fetching historical sales for:', userAddress);

  try {
    const sales = await readContract({
      address: MARKETPLACE_CONTRACT_ADDRESS,
      abi: ABI_MARKETPLACE,
      functionName: 'getSalesBySeller',
      args: [userAddress],
      chainId: 100,
    });

    const formattedSales: Sale[] = sales.map((sale: any) => ({
      buyerAddress: sale.buyer,
      tokenTransferred: formatUnits(sale.amount, 6), // USDC has 6 decimals
      gasFee: formatEther(sale.gasFee),
      timestamp: Number(sale.timestamp),
      assetName: sale.assetName,
      attestationStatus: sale.attestationStatus,
      verifyingNode: sale.verifyingNode,
    }));

    return formattedSales;

  } catch (error) {
    console.error('Error fetching historical sales:', error);
    throw new Error('Error fetching historical sales');
  }
};

// Function to fetch historical verifications
export const getUserHistoricalVerifications = async (userAddress: Address): Promise<Verification[]> => {
  console.log('Fetching historical verifications for:', userAddress);

  try {
    const verifications = await readContract({
      address: ATTESTATION_CONTRACT_ADDRESS,
      abi: ABI_ATTESTATION,
      functionName: 'getVerificationsByVerifier',
      args: [userAddress],
      chainId: 100,
    });

    const formattedVerifications: Verification[] = verifications.map((verif: any) => ({
      trader1: verif.trader1,
      trader2: verif.trader2,
      tokenTransferred: formatUnits(verif.amount, 6), // USDC has 6 decimals
      gasFee: formatEther(verif.gasFee),
      timestamp: Number(verif.timestamp),
      assetName: verif.assetName,
      attestationStatus: verif.attestationStatus,
      approved: verif.approved,
    }));

    return formattedVerifications;

  } catch (error) {
    console.error('Error fetching historical verifications:', error);
    throw new Error('Error fetching historical verifications');
  }
};

// Function to request asset attestation
export const requestAssetAttestation = async (assetId: string): Promise<string> => {
  console.log('Requesting attestation for asset:', assetId);

  try {
    const attestationTx = await writeContract({
      address: ATTESTATION_CONTRACT_ADDRESS,
      abi: ABI_ATTESTATION,
      functionName: 'requestAttestation',
      args: [assetId],
      chainId: 100, // Gnosis Chain ID
    });

    console.log('Attestation request transaction hash:', attestationTx.hash);
    await attestationTx.wait();

    console.log('Attestation requested successfully.');
    return attestationTx.hash;

  } catch (error) {
    console.error('Error requesting attestation:', error);
    throw new Error('Error requesting attestation');
  }
};
