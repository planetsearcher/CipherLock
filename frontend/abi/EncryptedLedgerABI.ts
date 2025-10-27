
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const EncryptedLedgerABI = {
  "abi": [
    {
      "inputs": [],
      "name": "getConfidentialBalance",
      "outputs": [
        {
          "internalType": "euint32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "encryptedDecrement",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "verificationProof",
          "type": "bytes"
        }
      ],
      "name": "secureDecrement",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "encryptedIncrement",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "verificationProof",
          "type": "bytes"
        }
      ],
      "name": "secureIncrement",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
} as const;

