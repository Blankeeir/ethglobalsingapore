// src/components/SellAsset.tsx
import React, { useState } from 'react';
import { createAssetForSale } from '@/shared/helpers';
import { Asset } from '@/shared/types';
import { useNavigate } from 'react-router-dom';

const SellAsset: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState<Asset>({
    name: '',
    length: 0,
    year: '',
    price: 0,
    image: '',
  });
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const listForSale = async () => {
    console.log('Listing asset for sale:', asset);
    if (!asset.name || !asset.length || !asset.year || !asset.price || !asset.image) {
      setError('Please fill out all fields');
      setSuccess(null);
      return;
    }

    try {
      const hash = await createAssetForSale(asset);
      console.log('Asset listed for sale with hash:', hash);
      setSuccess('Asset successfully listed for sale!');
      setError(null);
      // Optionally, navigate to Marketplace after a delay
      setTimeout(() => navigate('/marketplace'), 2000);
    } catch (e) {
      console.error('Error listing asset for sale:', e);
      setError('Failed to list asset for sale');
      setSuccess(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Sell My Asset</h1>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">List New Asset for Sale</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="mb-1">Name</span>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={asset.name}
              onChange={(e) => setAsset({ ...asset, name: e.target.value })}
              placeholder="Asset Name"
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1">Image URL</span>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={asset.image}
              onChange={(e) => setAsset({ ...asset, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1">Length (ft)</span>
            <input
              type="number"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={asset.length}
              onChange={(e) => setAsset({ ...asset, length: +e.target.value })}
              placeholder="e.g., 50"
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1">Year</span>
            <input
              type="number"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={asset.year}
              onChange={(e) => setAsset({ ...asset, year: e.target.value })}
              placeholder="e.g., 2023"
            />
          </label>
          <label className="flex flex-col">
            <span className="mb-1">Price (USDC)</span>
            <input
              type="number"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={asset.price}
              onChange={(e) => setAsset({ ...asset, price: +e.target.value })}
              placeholder="e.g., 1000"
            />
          </label>
          <button
            onClick={listForSale}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            List for Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellAsset;
