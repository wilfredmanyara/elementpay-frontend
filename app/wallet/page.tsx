"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function WalletPage() {
  const { isConnected, address, chain } = useAccount();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Wallet Connection</h1>
          
          <div className="text-center mb-8">
            <ConnectButton label='Connect Your Wallet' />
          </div>
          
          {isConnected && (
            <div className="space-y-4 border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900">Wallet Information</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-mono text-sm break-all">{address}</span>
                </div>
                
                {chain && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Chain:</span>
                    <span className="font-medium">{chain.name}</span>
                  </div>
                )}
                
                {chain && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Chain ID:</span>
                    <span className="font-mono">{chain.id}</span>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-gray-500 text-center">
                Your wallet is successfully connected. You can now create orders.
              </div>
            </div>
          )}
          
          {!isConnected && (
            <div className="text-center text-gray-600">
              <p>Connect your wallet to view wallet information and create orders.</p>
              <p className="text-sm mt-2">
                This application supports multiple wallet types including MetaMask and WalletConnect.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}