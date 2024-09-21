import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import { Asset, AssetStatus } from "./shared/types";
import { loadAssets, requestAssetAttestation } from "./shared/helpers";
import { Address } from "viem";

function Home() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const { isAuthenticated } = useDynamicContext();

  useEffect(() => {
    const getAssets = async () => {
      console.log("Getting assets");
      try {
        const data = await loadAssets();
        setAssets(data || []); // Ensure assets is always an array
      } catch (e) {
        console.error("Error getting assets:", e);
        setAssets([]); // Set assets to empty array on error
      }
    };
    getAssets();
  }, []);

  const handleRequestAttestation = async (assetId: Address) => {
    console.log("Requesting attestation");
    try {
      const hash = await requestAssetAttestation(assetId);
      console.log("Attestation requested:", hash);
      const updatedAssets = assets.map((asset) =>
        asset.address === assetId
          ? { ...asset, status: "requested" as AssetStatus }
          : asset
      );
      localStorage.setItem("assets", JSON.stringify(updatedAssets));
      setAssets(updatedAssets);
    } catch (e) {
      console.error("Error requesting attestation:", e);
    }
  };

  return (
    <>
      {/* <Identity /> */}
      <div className="main-container">
        <h1 className="text-2xl my-6">Buyer</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets?.map((asset) => (
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
                {isAuthenticated && asset.address && asset.status && (
                  <div>
                    {asset.status === "available" && (
                      <button
                        onClick={() =>
                          handleRequestAttestation(asset.address as Address)
                        }
                        className="bg-blue-500 text-white rounded-lg p-2"
                      >
                        Request Attestation
                      </button>
                    )}
                    {asset.status === "requested" && (
                      <p>Attestation requested</p>
                    )}
                    {asset.status === "attested" && <p>Attested</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
