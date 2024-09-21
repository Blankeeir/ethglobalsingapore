// src/components/Attest.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { loadAssetDetails, submitAttestation } from '@/shared/helpers';
import { Asset, Attestation } from '@/shared/types';

const Attest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [form, setForm] = useState({
    image: false,
    year: false,
    length: false,
    price: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      if (!id) return;
      try {
        const assetDetails = await loadAssetDetails(id);
        setAsset(assetDetails);
      } catch (err) {
        console.error('Error loading asset details:', err);
        setError('Failed to load asset details.');
      }
    };

    fetchAsset();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm({ ...form, [name]: checked });
  };

  const handleSubmit = async () => {
    if (!id) return;
    const allChecked = Object.values(form).every(Boolean);
    if (!allChecked) {
      setError('Please check all fields to approve attestation.');
      setSuccess(null);
      return;
    }

    setTransactionStatus('Submitting attestation...');
    try {
      await submitAttestation(id, true);
      setSuccess('Attestation successful!');
      setError(null);
      setTransactionStatus(null);
      // Optionally, refresh asset details
    } catch (err) {
      console.error('Error submitting attestation:', err);
      setError('Attestation failed.');
      setSuccess(null);
      setTransactionStatus(null);
    }
  };

  if (!asset) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Attest Asset: {asset.name}</h1>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Attestation Form</h2>
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="image"
              checked={form.image}
              onChange={handleChange}
            />
            Image is authentic
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="year"
              checked={form.year}
              onChange={handleChange}
            />
            Year is correct
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="length"
              checked={form.length}
              onChange={handleChange}
            />
            Length is accurate
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="price"
              checked={form.price}
              onChange={handleChange}
            />
            Price is fair
          </label>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Submit Attestation
          </button>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          {transactionStatus && <p className="text-gray-500">{transactionStatus}</p>}
        </div>
      </div>
    </div>
  );
};

export default Attest;
