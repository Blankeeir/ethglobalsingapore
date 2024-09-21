import { Address } from "viem";

export type AssetStatus = "available" | "requested" | "attested";

export interface Asset {
  name: string;
  length: number;
  year: string;
  price: number;
  address?: Address;
  status?: AssetStatus;
}
