
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const SecureMessengerABI = {
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "messageId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "transmissionTime",
          "type": "uint256"
        }
      ],
      "name": "SecureMessageTransmitted",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "messageId",
          "type": "uint256"
        }
      ],
      "name": "getEncryptedPayload",
      "outputs": [
        {
          "internalType": "euint256",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalTransmissions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "messageId",
          "type": "uint256"
        }
      ],
      "name": "getTransmissionMetadata",
      "outputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "transmissionTime",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "getTransmissionsBySender",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "transmissionIds",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        }
      ],
      "name": "getTransmissionsForRecipient",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "transmissionIds",
          "type": "uint256[]"
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
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "externalEuint256",
          "name": "encryptedPayload",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "verificationProof",
          "type": "bytes"
        }
      ],
      "name": "transmitSecureMessage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
} as const;

