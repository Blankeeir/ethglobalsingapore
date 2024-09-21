import { attestAsset, loadAssets } from "@/shared/helpers";
import { Asset, AssetStatus } from "@/shared/types";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import { Address } from "viem";

export const Surveyor = () => {
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const { isAuthenticated } = useDynamicContext();

  useEffect(() => {
    const getAssets = async () => {
      console.log("Getting assets");
      try {
        const data = await loadAssets();
        setAllAssets(data);
        setAssets(
          data.filter(
            (asset) =>
              asset.status === "requested" || asset.status === "attested"
          )
        );
      } catch (e) {
        console.error("Error getting assets:", e);
      }
    };
    getAssets();
  }, []);

  const handeAssetAttestation = async (assetId: Address) => {
    console.log("Requesting attestation");
    // Call smart contract to request attestation
    try {
      const hash = await attestAsset(assetId);
      console.log("Attestation requested:", hash);
      const updatedAssets = assets.map((asset) =>
        asset.address === assetId
          ? { ...asset, status: "attested" as AssetStatus }
          : asset
      );

      localStorage.setItem(
        "assets",
        JSON.stringify(
          allAssets.map((asset) =>
            asset.address === assetId
              ? { ...asset, status: "attested" as AssetStatus }
              : asset
          )
        )
      );
      setAssets(updatedAssets);
    } catch (e) {
      console.error("Error requesting attestation:", e);
    }
  };

  return (
    <div className="main-container">
      <h1 className="text-2xl my-6">Surveyor</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.name}
            className="border-2 bg-white rounded-lg shadow-sm p-4"
          >
            <h2 className="text-xl font-semibold">{asset.name}</h2>
            <div className="grid grid-cols-2">
              <div>
                <p>Length: {asset.length} ft</p>
                <p>Year: {asset.year}</p>
                <p>Price: {asset.price}</p>
              </div>
              {asset.status === "requested" && asset.address && (
                <div>
                  Confirm the asset details and attest to the authenticity of
                  the asset.
                  <button
                    onClick={() =>
                      handeAssetAttestation(asset.address as Address)
                    }
                    className="btn btn-primary block mt-2"
                  >
                    Attest
                  </button>
                </div>
              )}
              {asset.status === "attested" && (
                <div>
                  <p>Asset attested</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
