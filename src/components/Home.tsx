// src/components/Home.tsx
import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
// import { ConnectButton } from '@rainbow-me/rainbowkit';

const Home: React.FC = () => {
  const { isAuthenticated, login } = useDynamicContext();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-5xl font-bold mb-8">Welcome to Attornato</h1>
      {!isAuthenticated ? (
        <>
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg mb-4 hover:bg-blue-600 transition"
          >
            Login / Sign Up
          </button>
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            View My Balance
          </button>
        </>
      ) : (
        <p className="text-xl">You are logged in! Navigate using the menu above.</p>
      )}
    </div>
  );
};

export default Home;
