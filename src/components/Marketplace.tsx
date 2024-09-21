// src/components/Marketplace.tsx
import React, { useEffect, useState } from 'react';
import { loadAssets } from '@/shared/helpers';
import { Asset } from '@/shared/types';
import { Link } from 'react-router-dom';

const Marketplace: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const loadedAssets = await loadAssets();
        setAssets(loadedAssets);
      } catch (error) {
        console.error('Error loading assets:', error);
      }
    };

    fetchAssets();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Marketplace</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {assets.length > 0 ? (
          assets.map((asset) => (
            <div key={asset.address} className="border rounded-lg overflow-hidden shadow-lg bg-white">
              <img src={asset.image} alt={asset.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-2">{asset.name}</h2>
                <p className="text-gray-600 mb-1">Price: {asset.price} USDC</p>
                <p className="text-gray-600 mb-4">Attestation Status: {asset.status}</p>
                <div className="flex justify-between">
                  <Link to={`/asset/${asset.address}`} className="text-blue-500 hover:underline">
                    View Details
                  </Link>
                  {/* Future Buttons: Buy and Attest and Buy */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">No assets available for sale.</p>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
