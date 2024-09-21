import { createAssetForSale } from "@/shared/helpers";
import { Asset } from "@/shared/types";
import { useState } from "react";

export const Seller = () => {
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState<Asset>({
    name: "",
    length: 0,
    year: "",
    price: 0,
  });

  const listForSale = async () => {
    console.log("Listing asset for sale:", asset);
    if (!asset.name || !asset.length || !asset.year || !asset.price) {
      setError("Please fill out all fields");
      return;
    }

    // Call smart contract to list asset for sale
    try {
      const hash = await createAssetForSale(asset);
      console.log("Asset listed for sale with hash:", hash);
    } catch (e) {
      console.error("Error listing asset for sale:", e);
    }
  };

  return (
    <div className="main-container">
      <h1 className="text-2xl my-6">Seller</h1>
      <div className="max-w-md">
        <h2 className="text-xl mb-2">List new asset for sale:</h2>
        <div className="text-red-500 mb-2">{error}</div>
        <div>
          <label className="input input-bordered flex items-center gap-2 mb-2">
            Name
            <input
              type="text"
              className="grow"
              placeholder="Name"
              value={asset.name}
              onChange={(e) => setAsset({ ...asset, name: e.target.value })}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 mb-2">
            Length (ft)
            <input
              type="number"
              className="grow"
              placeholder="Length"
              value={asset.length}
              onChange={(e) => setAsset({ ...asset, length: +e.target.value })}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 mb-2">
            Year
            <input
              type="text"
              className="grow"
              placeholder="Year"
              value={asset.year}
              onChange={(e) => setAsset({ ...asset, year: e.target.value })}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 mb-2">
            Price (USDC)
            <input
              type="number"
              className="grow"
              placeholder="Price"
              value={asset.price}
              onChange={(e) => setAsset({ ...asset, price: +e.target.value })}
            />
          </label>
        </div>
        <button onClick={listForSale} className="btn btn-primary mt-2">
          List for Sale
        </button>
      </div>
    </div>
  );
};
