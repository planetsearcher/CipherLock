"use client";

import { useState } from "react";
import { useFhevm } from "../fhevm/useFhevm";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { useSecureMessenger } from "@/hooks/useSecureMessenger";

/*
 * Privacy Vault - Enterprise-grade secure messaging platform with FHE encryption
 * Complete redesign with modern dark theme and enterprise UX
 */
export const SecureMessengerDemo = () => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  //////////////////////////////////////////////////////////////////////////////
  // FHEVM instance
  //////////////////////////////////////////////////////////////////////////////

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  //////////////////////////////////////////////////////////////////////////////
  // Secure Messenger Hook
  //////////////////////////////////////////////////////////////////////////////

  const secureMessenger = useSecureMessenger({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  //////////////////////////////////////////////////////////////////////////////
  // Local State for UI
  //////////////////////////////////////////////////////////////////////////////

  const [recipientAddress, setRecipientAddress] = useState("");
  const [confidentialMessage, setConfidentialMessage] = useState("");

  //////////////////////////////////////////////////////////////////////////////
  // Navigation State
  //////////////////////////////////////////////////////////////////////////////

  const [activeTab, setActiveTab] = useState<'compose' | 'messages' | 'analytics'>('compose');

  //////////////////////////////////////////////////////////////////////////////
  // Enterprise Dark Theme Components
  //////////////////////////////////////////////////////////////////////////////

  const renderSidebar = () => (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">🔐</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Privacy Vault</h1>
            <p className="text-gray-400 text-sm">Enterprise Security</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveTab('compose')}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
            activeTab === 'compose'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">✍️</span>
            <div>
              <div className="font-medium">Compose Message</div>
              <div className="text-xs opacity-75">Send secure communications</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
            activeTab === 'messages'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">📨</span>
            <div>
              <div className="font-medium">Message Vault</div>
              <div className="text-xs opacity-75">{secureMessenger.totalTransmissions} messages</div>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">📊</span>
            <div>
              <div className="font-medium">Analytics</div>
              <div className="text-xs opacity-75">Network status</div>
            </div>
          </div>
        </button>
      </nav>

      {/* Status Bar */}
      <div className="p-4 border-t border-gray-700 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Network:</span>
          <span className="text-green-400 font-mono">{chainId}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">FHEVM:</span>
          <span className={fhevmInstance ? "text-green-400" : "text-red-400"}>
            {fhevmStatus}
          </span>
        </div>
        {!isConnected ? (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-red-400 text-sm ml-2">Wallet disconnected</span>
            </div>
            <button
              onClick={connect}
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>🔗 Connect MetaMask</span>
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex items-center justify-center">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-green-400 text-sm ml-2">Wallet connected</span>
            </div>
            <div className="text-xs text-gray-500 font-mono mt-1">
              {ethersSigner?.address?.slice(0, 6)}...{ethersSigner?.address?.slice(-4)}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderComposeTab = () => (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Compose Secure Message</h2>
          <p className="text-gray-400">Send confidential communications with enterprise-grade encryption</p>
        </div>


        {/* Compose Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (recipientAddress && confidentialMessage) {
                secureMessenger.transmitSecureMessage(recipientAddress, confidentialMessage);
                setRecipientAddress("");
                setConfidentialMessage("");
              }
            }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Recipient Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  required
                />
                <div className="absolute right-3 top-3 text-gray-500">
                  <span className="text-sm">🔗</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Confidential Message
              </label>
              <div className="relative">
                <textarea
                  placeholder="Enter your secure message here..."
                  value={confidentialMessage}
                  onChange={(e) => setConfidentialMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                  rows={6}
                  maxLength={280}
                  required
                />
                <div className="absolute bottom-3 right-3 text-gray-500 text-sm">
                  {confidentialMessage.length}/280
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>FHE Encrypted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Blockchain Secured</span>
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                disabled={!recipientAddress || !confidentialMessage || secureMessenger.isTransmitting || !isConnected}
              >
                {secureMessenger.isTransmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Encrypting...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 Transmit Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderMessagesTab = () => (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Message Vault</h2>
            <p className="text-gray-400">{secureMessenger.totalTransmissions} confidential transmissions stored</p>
          </div>
          <button
            onClick={secureMessenger.loadMessages}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            disabled={secureMessenger.isLoading}
          >
            {secureMessenger.isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
            ) : (
              <span>🔄</span>
            )}
            <span>Refresh</span>
          </button>
        </div>

        {/* Messages Grid */}
        <div className="space-y-4">
          {secureMessenger.messages.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Messages Yet</h3>
              <p className="text-gray-500">Be the first to establish confidential communications in this vault.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {secureMessenger.messages.map((message) => (
                <div key={message.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-sm text-gray-400 mb-1">From</div>
                      <div className="font-mono text-sm text-blue-400 bg-blue-900/20 px-2 py-1 rounded">
                        {message.sender.slice(0, 8)}...{message.sender.slice(-6)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        {new Date(message.transmissionTime * 1000).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-1">To</div>
                    <div className="font-mono text-sm text-purple-400 bg-purple-900/20 px-2 py-1 rounded">
                      {message.recipient.slice(0, 8)}...{message.recipient.slice(-6)}
                    </div>
                  </div>

                  {message.isDecrypted && message.content ? (
                    <div className="bg-gray-900/50 rounded-lg p-4 border-l-4 border-green-500">
                      <p className="text-gray-200 italic">&ldquo;{message.content}&rdquo;</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => secureMessenger.decryptMessage(message.id)}
                      className="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
                      disabled={secureMessenger.isDecrypting}
                    >
                      {secureMessenger.isDecrypting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Decrypting...</span>
                        </>
                      ) : (
                        <>
                          <span>🔓 Decrypt Message</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">System Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Network Status */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Network Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Chain ID</span>
                <span className="text-green-400 font-mono">{chainId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Wallet</span>
                <span className={isConnected ? "text-green-400" : "text-red-400"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Signer</span>
                <span className="text-blue-400 font-mono text-sm">
                  {ethersSigner?.address?.slice(0, 6)}...{ethersSigner?.address?.slice(-4)}
                </span>
              </div>
            </div>
          </div>

          {/* Contract Status */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Contract Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">SecureMessenger</span>
                <span className={secureMessenger.isDeployed ? "text-green-400" : "text-red-400"}>
                  {secureMessenger.isDeployed ? "Deployed" : "Not Found"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Contract Address</span>
                <span className="text-purple-400 font-mono text-sm">
                  {secureMessenger.contractAddress?.slice(0, 6)}...{secureMessenger.contractAddress?.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Messages</span>
                <span className="text-yellow-400 font-semibold">{secureMessenger.totalTransmissions}</span>
              </div>
            </div>
          </div>

          {/* FHEVM Status */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">FHEVM Engine</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <span className="text-cyan-400">{fhevmStatus}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Instance</span>
                <span className={fhevmInstance ? "text-green-400" : "text-red-400"}>
                  {fhevmInstance ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Encryption</span>
                <span className="text-green-400">FHE Enabled</span>
              </div>
            </div>
          </div>

          {/* Security Metrics */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Security Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Messages Encrypted</span>
                <span className="text-green-400">{secureMessenger.totalTransmissions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Access Control</span>
                <span className="text-blue-400">Recipient Only</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Storage</span>
                <span className="text-purple-400">Blockchain</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {secureMessenger.message && (
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl">
            <p className="text-blue-300">{secureMessenger.message}</p>
          </div>
        )}

        {fhevmError && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-500/20 rounded-xl">
            <p className="text-red-300">FHEVM Error: {fhevmError.message}</p>
          </div>
        )}
      </div>
    </div>
  );

  // Debug information
  console.log("Debug Info:", {
    chainId,
    isConnected,
    secureMessengerAddress: secureMessenger.contractAddress,
    isDeployed: secureMessenger.isDeployed
  });

  // Only show contract not deployed message if we have a chainId but contract is not deployed
  if (chainId && secureMessenger.isDeployed === false) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-4">Contract Not Deployed</h1>
          <p className="text-gray-400 mb-6">
            SecureMessenger contract not found on chain {chainId}. Please deploy the contract first.
          </p>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-500">Run `npx hardhat deploy` to deploy contracts</p>
          </div>
          <div className="mt-4 text-xs text-gray-600">
            Debug: chainId={chainId}, isDeployed={String(secureMessenger.isDeployed)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {renderSidebar()}
      {activeTab === 'compose' && renderComposeTab()}
      {activeTab === 'messages' && renderMessagesTab()}
      {activeTab === 'analytics' && renderAnalyticsTab()}
    </div>
  );
};
