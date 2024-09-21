// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

import Header from './components/Header';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import SellAsset from './components/SellAsset';
import AssetDetails from './components/AssetDetails';
import Attest from './components/Attest';

function App() {
  const { isAuthenticated } = useDynamicContext();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/sell" element={<SellAsset />} />
            <Route path="/asset/:id" element={<AssetDetails />} />
            <Route path="/attest/:id" element={<Attest />} />
          </>
        ) : (
          // Redirect unauthenticated users to Home
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </>
  );
}

export default App;
