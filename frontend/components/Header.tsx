"use client";

import { useMetaMaskEthersSigner } from "@/hooks/metamask/useMetaMaskEthersSigner";
import Image from "next/image";

export const Header = () => {
  const {
    chainId,
    accounts,
    isConnected,
    connect,
  } = useMetaMaskEthersSigner();

  const buttonClass =
    "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 font-semibold text-white shadow-lg " +
    "transition-all duration-200 hover:from-blue-700 hover:to-purple-700 active:scale-95 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Image
              src="/zama-logo.svg"
              alt="Zama Logo"
              width={40}
              height={40}
            />
            <h1 className="text-xl font-bold text-white">Privacy Vault</h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Network Info */}
            {isConnected && chainId && (
              <div className="text-sm text-gray-300">
                Chain: {chainId === 31337 ? 'Localhost' : chainId}
              </div>
            )}

            {/* Wallet Address */}
            {isConnected && accounts && accounts[0] && (
              <div className="text-sm text-gray-300 font-mono">
                {accounts[0].slice(0, 6)}...{accounts[0].slice(-4)}
              </div>
            )}

            {/* Connect/Disconnect Button */}
            {!isConnected ? (
              <button
                className={buttonClass}
                onClick={connect}
              >
                Connect MetaMask
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-300">Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
