import { Buffer } from "buffer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";
import { config } from "./wagmi.ts";

import "./index.css";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import Home from "./Home.tsx";
import { Seller } from "./seller/Seller.tsx";
import { Surveyor } from "./surveyor/Surveyor.tsx";

globalThis.Buffer = Buffer;

const queryClient = new QueryClient();

// localStorage.setItem(
//   "assets",
//   JSON.stringify([
//     {
//       name: "Small Boat",
//       length: 30,
//       year: "1990",
//       price: 100000,
//       address: "0x1234567890123456789012345678901234567890",
//       status: "available",
//     },
//     {
//       name: "Big Boat",
//       length: 100,
//       year: "2010",
//       price: 800000,
//       address: "0x1234567890123456789012345678901234567891",
//       status: "available",
//     },
//   ])
// );

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/seller",
        element: <Seller />,
      },
      {
        path: "/surveyor",
        element: <Surveyor />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DynamicContextProvider
      settings={{
        environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
            <RouterProvider router={router} />
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  </React.StrictMode>
);
