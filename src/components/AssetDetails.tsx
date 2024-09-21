// src/components/AssetDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadAssetDetails, purchaseAsset, attestAndBuyAsset } from '@/shared/helpers';
import { Asset, Attestation } from '@/shared/types';

const AssetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      if (!id) return;
      try {
        const assetDetails = await loadAssetDetails(id);
        setAsset(assetDetails);
        setAttestations(assetDetails.attestations || []);
      } catch (err) {
        console.error('Error loading asset details:', err);
        setError('Failed to load asset details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  const handleBuy = async () => {
    if (!id) return;
    setTransactionStatus('Processing purchase...');
    try {
      await purchaseAsset(id);
      setTransactionStatus('Purchase successful!');
      // Optionally, refresh asset details or navigate
    } catch (err) {
      console.error('Error purchasing asset:', err);
      setTransactionStatus('Purchase failed.');
    }
  };

  const handleAttestAndBuy = async () => {
    if (!id) return;
    setTransactionStatus('Processing attestation and purchase...');
    try {
      await attestAndBuyAsset(id);
      setTransactionStatus('Attestation and purchase successful!');
      // Optionally, refresh asset details or navigate
    } catch (err) {
      console.error('Error attesting and buying asset:', err);
      setTransactionStatus('Attestation and purchase failed.');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!asset) return <p className="text-center mt-10">Asset not found.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">{asset.name}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <img src={asset.image} alt={asset.name} className="w-full md:w-1/3 h-auto object-cover rounded-lg shadow-lg" />
        <div className="flex-1">
          <p className="text-xl mb-2"><strong>Price:</strong> {asset.price} USDC</p>
          <p className="text-xl mb-2"><strong>Length:</strong> {asset.length} ft</p>
          <p className="text-xl mb-2"><strong>Year:</strong> {asset.year}</p>
          <p className="text-xl mb-4"><strong>Attestation Status:</strong> {asset.status}</p>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleBuy}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition flex-1"
            >
              Buy
            </button>
            {asset.status === 'not open to attestation' && (
              <button
                onClick={handleAttestAndBuy}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition flex-1"
              >
                Attest and Buy
              </button>
            )}
          </div>
          {transactionStatus && <p className="mt-4 text-center">{transactionStatus}</p>}
        </div>
      </div>

      {/* Attestation History */}
      <div className="mt-12">
        <h2 className="text-3xl font-semibold mb-4 text-center">Attestation History</h2>
        {attestations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Verifier</th>
                  <th className="py-2 px-4 border-b">Timestamp</th>
                  <th className="py-2 px-4 border-b">Result</th>
                </tr>
              </thead>
              <tbody>
                {attestations.map((attestation, index) => (
                  <tr key={index} className="text-center">
                    <td className="py-2 px-4 border-b">{attestation.verifier}</td>
                    <td className="py-2 px-4 border-b">{new Date(attestation.timestamp * 1000).toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">{attestation.success ? 'Success' : 'Failure'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No attestations yet.</p>
        )}
      </div>
    </div>
  );
};

export default AssetDetails;
