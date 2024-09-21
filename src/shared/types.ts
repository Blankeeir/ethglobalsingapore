// src/shared/types.ts
import { Address } from 'viem';

export type AssetStatus = 'not open to attestation' | 'open to attestation';

export interface Asset {
  name: string;
  length: number;
  year: string;
  price: number;
  image: string;
  address?: Address;
  status?: AssetStatus;
  attestations?: Attestation[];
}

export interface Purchase {
  sellerAddress: string;
  tokenTransferred: string;
  gasFee: string;
  timestamp: number;
  assetName: string;
  attestationStatus: string;
  verifyingNode: string;
}

export interface Sale {
  buyerAddress: string;
  tokenTransferred: string;
  gasFee: string;
  timestamp: number;
  assetName: string;
  attestationStatus: string;
  verifyingNode: string;
}

export interface Verification {
  trader1: string;
  trader2: string;
  tokenTransferred: string;
  gasFee: string;
  timestamp: number;
  assetName: string;
  attestationStatus: string;
  approved: boolean;
}

export interface Attestation {
  verifier: string;
  timestamp: number;
  success: boolean;
}
