// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { getUserHistoricalPurchases, getUserHistoricalSales, getUserHistoricalVerifications } from '@/shared/helpers';
import { Purchase, Sale, Verification } from '@/shared/types';

const Dashboard: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userPurchases = await getUserHistoricalPurchases();
        const userSales = await getUserHistoricalSales();
        const userVerifications = await getUserHistoricalVerifications();

        setPurchases(userPurchases);
        setSales(userSales);
        setVerifications(userVerifications);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Dashboard</h1>

      {/* Historical Purchases */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Historical Purchases</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Seller Address</th>
                <th className="py-2 px-4 border-b">Token Transferred</th>
                <th className="py-2 px-4 border-b">Gas Fee</th>
                <th className="py-2 px-4 border-b">Timestamp</th>
                <th className="py-2 px-4 border-b">Asset Info</th>
                <th className="py-2 px-4 border-b">Verifying Node</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{purchase.sellerAddress}</td>
                  <td className="py-2 px-4 border-b">{purchase.tokenTransferred}</td>
                  <td className="py-2 px-4 border-b">{purchase.gasFee}</td>
                  <td className="py-2 px-4 border-b">{new Date(purchase.timestamp * 1000).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">
                    {purchase.assetName} ({purchase.attestationStatus})
                  </td>
                  <td className="py-2 px-4 border-b">{purchase.verifyingNode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Sales */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Historical Sales</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Buyer Address</th>
                <th className="py-2 px-4 border-b">Token Transferred</th>
                <th className="py-2 px-4 border-b">Gas Fee</th>
                <th className="py-2 px-4 border-b">Timestamp</th>
                <th className="py-2 px-4 border-b">Asset Info</th>
                <th className="py-2 px-4 border-b">Verifying Node</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{sale.buyerAddress}</td>
                  <td className="py-2 px-4 border-b">{sale.tokenTransferred}</td>
                  <td className="py-2 px-4 border-b">{sale.gasFee}</td>
                  <td className="py-2 px-4 border-b">{new Date(sale.timestamp * 1000).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">
                    {sale.assetName} ({sale.attestationStatus})
                  </td>
                  <td className="py-2 px-4 border-b">{sale.verifyingNode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Verifications */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Historical Verifications</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Trader Addresses</th>
                <th className="py-2 px-4 border-b">Token Transferred</th>
                <th className="py-2 px-4 border-b">Gas Fee</th>
                <th className="py-2 px-4 border-b">Timestamp</th>
                <th className="py-2 px-4 border-b">Asset Info</th>
                <th className="py-2 px-4 border-b">Approval</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((verification, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">
                    {verification.trader1} &amp; {verification.trader2}
                  </td>
                  <td className="py-2 px-4 border-b">{verification.tokenTransferred}</td>
                  <td className="py-2 px-4 border-b">{verification.gasFee}</td>
                  <td className="py-2 px-4 border-b">{new Date(verification.timestamp * 1000).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">
                    {verification.assetName} ({verification.attestationStatus})
                  </td>
                  <td className="py-2 px-4 border-b">{verification.approved ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
