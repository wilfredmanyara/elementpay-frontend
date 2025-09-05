"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function WalletPage() {
  const { isConnected, address, chain } = useAccount();

  return (
    <div className="main-section mt-20">
      <div className="gradient-border max-w-2xl w-full">
        <div className="page-heading">
          <h1>Wallet Connection</h1>
        </div>

        <div className="flex justify-center items-center mb-8">
          <ConnectButton label="Connect Your Wallet" />
        </div>

        {isConnected && (
          <div className="space-y-6 border-t border-light-blue-200 pt-8">
            <h2>Wallet Information</h2>

            <div className="gradient-border space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-dark-200">Status:</span>
                <span className="score-badge bg-badge-green text-badge-green-text">
                  Connected
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-dark-200">Address:</span>
                <span className="font-mono text-sm break-all">{address}</span>
              </div>

              {chain && (
                <div className="flex justify-between items-center">
                  <span className="text-dark-200">Chain:</span>
                  <span className="font-medium">{chain.name}</span>
                </div>
              )}

              {chain && (
                <div className="flex justify-between items-center">
                  <span className="text-dark-200">Chain ID:</span>
                  <span className="font-mono">{chain.id}</span>
                </div>
              )}
            </div>

            <div className="text-sm text-dark-200 text-center opacity-70">
              Your wallet is successfully connected. You can now create orders.
            </div>
          </div>
        )}

        {!isConnected && (
          <div className="text-center text-dark-200">
            <p>
              Connect your wallet to view wallet information and create orders.
            </p>
            <p className="text-sm mt-4 opacity-70">
              This application supports multiple wallet types including MetaMask
              and WalletConnect.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
